package com.afripay.application.usecase.payment;

import com.afripay.domain.exception.DomainExceptions.*;
import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Money;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.port.in.payment.InitiatePaymentUseCase;
import com.afripay.domain.port.out.persistence.MerchantRepository;
import com.afripay.domain.port.out.persistence.TransactionRepository;
import com.afripay.domain.port.out.provider.PaymentProviderPort;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Application service — orchestrates payment initiation.
 *
 * <p>No business logic lives here — only orchestration.
 * All invariants are enforced inside domain aggregates.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InitiatePaymentService implements InitiatePaymentUseCase {

    private final MerchantRepository merchantRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentProviderRegistry providerRegistry;
    private final WebhookDispatcherPort webhookDispatcher;

    @Override
    @Transactional
    @CircuitBreaker(name = "payment-initiation", fallbackMethod = "handleProviderUnavailable")
    public Transaction initiate(Command command) {
        log.info("Initiating payment: merchantId={}, externalRef={}, provider={}, amount={}{}",
            command.merchantId(), command.externalRef(),
            command.provider(), command.amountMinorUnits(), command.currencyCode());

        // 1. Load and validate merchant
        MerchantId merchantId = MerchantId.of(command.merchantId());
        Merchant merchant = merchantRepository.findById(merchantId)
            .orElseThrow(() -> new MerchantNotFoundException(merchantId));
        merchant.assertActive();

        // 2. Idempotency check
        if (command.idempotencyKey() != null) {
            var existing = transactionRepository.findByIdempotencyKey(command.idempotencyKey());
            if (existing.isPresent()) {
                log.info("Idempotent request — returning existing transaction: {}", existing.get().getId());
                return existing.get();
            }
        }

        // 3. Duplicate detection by merchant external reference
        var duplicate = transactionRepository.findByExternalRef(command.externalRef(), merchantId);
        if (duplicate.isPresent()) {
            throw new DuplicateTransactionException(command.externalRef());
        }

        // 4. Build domain transaction
        Money amount = Money.of(command.amountMinorUnits(), command.currencyCode());
        Transaction transaction = Transaction.create(
            merchantId, command.externalRef(), command.idempotencyKey(),
            command.provider(), command.type(), amount,
            command.phoneNumber(), command.customerRef(), command.metadata()
        );

        // 5. Persist PENDING first — ensures record exists even on provider timeout
        Transaction saved = transactionRepository.save(transaction);
        log.debug("Transaction persisted in PENDING state: {}", saved.getId());

        // 6. Call provider (non-blocking)
        PaymentProviderPort provider = providerRegistry.getProvider(command.provider());
        provider.initiatePayment(saved)
            .subscribe(
                response -> handleProviderResponse(saved, response),
                error    -> handleProviderError(saved, error)
            );

        // 7. Return PENDING immediately — updates arrive via webhook/polling
        return saved;
    }

    @Transactional
    protected void handleProviderResponse(Transaction transaction, PaymentProviderPort.ProviderResponse response) {
        Transaction fresh = transactionRepository.findById(transaction.getId()).orElseThrow();
        switch (response.status()) {
            case SUCCESS -> {
                fresh.markSuccess(response.providerTransactionId(), response.rawResponse());
                transactionRepository.save(fresh);
                webhookDispatcher.dispatch(fresh, "transaction.success");
                log.info("Transaction {} succeeded: providerTxId={}", fresh.getId(), response.providerTransactionId());
            }
            case FAILED -> {
                fresh.markFailed(response.failureReason(), response.rawResponse());
                transactionRepository.save(fresh);
                webhookDispatcher.dispatch(fresh, "transaction.failed");
                log.warn("Transaction {} failed: reason={}", fresh.getId(), response.failureReason());
            }
            case PENDING -> log.debug("Transaction {} still pending at provider", fresh.getId());
        }
    }

    @Transactional
    protected void handleProviderError(Transaction transaction, Throwable error) {
        log.error("Provider error for transaction {}: {}", transaction.getId(), error.getMessage());
        Transaction fresh = transactionRepository.findById(transaction.getId()).orElseThrow();
        fresh.markFailed("Provider communication error: " + error.getMessage(), Map.of());
        transactionRepository.save(fresh);
        webhookDispatcher.dispatch(fresh, "transaction.failed");
    }

    @SuppressWarnings("unused")
    private Transaction handleProviderUnavailable(Command command, Throwable t) {
        log.error("Circuit breaker open for payment initiation: {}", t.getMessage());
        throw new ProviderUnavailableException(command.provider().name(), t);
    }
}
