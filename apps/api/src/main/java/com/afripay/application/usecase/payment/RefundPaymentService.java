package com.afripay.application.usecase.payment;

import com.afripay.domain.exception.DomainExceptions.*;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.model.transaction.TransactionType;
import com.afripay.domain.port.in.payment.RefundPaymentUseCase;
import com.afripay.domain.port.out.persistence.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundPaymentService implements RefundPaymentUseCase {

    private final TransactionRepository transactionRepository;
    private final PaymentProviderRegistry providerRegistry;
    private final WebhookDispatcherPort webhookDispatcher;

    @Override
    @Transactional
    public Transaction refund(Command command) {
        log.info("Refund requested: originalTxId={}, merchantId={}",
            command.originalTransactionId(), command.merchantId());

        TransactionId originalId = TransactionId.of(command.originalTransactionId());
        MerchantId merchantId    = MerchantId.of(command.merchantId());

        // 1. Idempotency check
        if (command.idempotencyKey() != null) {
            var existing = transactionRepository.findByIdempotencyKey(command.idempotencyKey());
            if (existing.isPresent()) {
                log.info("Idempotent refund request — returning existing: {}", existing.get().getId());
                return existing.get();
            }
        }

        // 2. Load original transaction — must belong to this merchant
        Transaction original = transactionRepository
            .findByIdAndMerchantId(originalId, merchantId)
            .orElseThrow(() -> new TransactionNotFoundException(originalId));

        // 3. Assert refundable (domain rule)
        if (!original.canBeRefunded()) {
            throw new TransactionNotRefundableException(original.getId(), original.getStatus());
        }

        // 4. Create REFUND transaction record (for audit trail)
        Transaction refundTx = Transaction.create(
            merchantId,
            "refund-" + original.getExternalRef(),
            command.idempotencyKey(),
            original.getProvider(),
            TransactionType.REFUND,
            original.getAmount(),
            original.getPhoneNumber(),
            "Refund: " + (command.reason() != null ? command.reason() : original.getCustomerRef()),
            Map.of("originalTransactionId", original.getId().toString())
        );
        Transaction savedRefund = transactionRepository.save(refundTx);

        // 5. Call provider refund
        var provider = providerRegistry.getProvider(original.getProvider());
        provider.refund(original.getProviderTransactionId(), savedRefund)
            .subscribe(
                response -> {
                    if (response.isSuccess()) {
                        savedRefund.markSuccess(response.providerTransactionId(), response.rawResponse());
                        original.markReversed();
                        transactionRepository.save(savedRefund);
                        transactionRepository.save(original);
                        webhookDispatcher.dispatch(original, "transaction.reversed");
                        log.info("Refund successful for original tx: {}", original.getId());
                    } else if (response.isFailed()) {
                        savedRefund.markFailed(response.failureReason(), response.rawResponse());
                        transactionRepository.save(savedRefund);
                        log.warn("Refund failed for original tx {}: {}", original.getId(), response.failureReason());
                    }
                },
                error -> {
                    savedRefund.markFailed("Provider refund error: " + error.getMessage(), Map.of());
                    transactionRepository.save(savedRefund);
                    log.error("Provider error during refund: {}", error.getMessage());
                }
            );

        return savedRefund;
    }
}
