package com.afripay.application.usecase.payment;

import com.afripay.domain.exception.DomainExceptions.*;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.port.in.payment.VerifyPaymentUseCase;
import com.afripay.domain.port.out.persistence.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerifyPaymentService implements VerifyPaymentUseCase {

    private final TransactionRepository transactionRepository;
    private final PaymentProviderRegistry providerRegistry;
    private final WebhookDispatcherPort webhookDispatcher;

    @Override
    @Transactional
    public Transaction verify(String transactionId, String merchantId) {
        TransactionId txId = TransactionId.of(transactionId);
        MerchantId mId    = MerchantId.of(merchantId);

        Transaction transaction = transactionRepository
            .findByIdAndMerchantId(txId, mId)
            .orElseThrow(() -> new TransactionNotFoundException(txId));

        if (transaction.isTerminal()) {
            return transaction;
        }

        if (transaction.getProviderTransactionId() != null) {
            var provider = providerRegistry.getProvider(transaction.getProvider());
            provider.checkStatus(transaction.getProviderTransactionId())
                .subscribe(response -> {
                    if (response.isSuccess()) {
                        transaction.markSuccess(response.providerTransactionId(), response.rawResponse());
                        transactionRepository.save(transaction);
                        webhookDispatcher.dispatch(transaction, "transaction.success");
                    } else if (response.isFailed()) {
                        transaction.markFailed(response.failureReason(), response.rawResponse());
                        transactionRepository.save(transaction);
                        webhookDispatcher.dispatch(transaction, "transaction.failed");
                    }
                });
        }

        return transaction;
    }
}
