package com.afripay.domain.model.checkout;

import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Money;
import com.afripay.domain.model.transaction.TransactionId;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.UUID;

public class CheckoutSession {

    private final UUID id;
    private final MerchantId merchantId;
    private final Money amount;
    private final String returnUrl;
    
    private CheckoutSessionStatus status;
    private TransactionId transactionId;
    
    private final Instant expiresAt;
    private final Instant createdAt;

    private CheckoutSession(UUID id, MerchantId merchantId, Money amount, String returnUrl,
                            CheckoutSessionStatus status, TransactionId transactionId,
                            Instant expiresAt, Instant createdAt) {
        this.id = Objects.requireNonNull(id);
        this.merchantId = Objects.requireNonNull(merchantId);
        this.amount = Objects.requireNonNull(amount);
        this.returnUrl = Objects.requireNonNull(returnUrl);
        this.status = Objects.requireNonNull(status);
        this.transactionId = transactionId;
        this.expiresAt = Objects.requireNonNull(expiresAt);
        this.createdAt = Objects.requireNonNull(createdAt);
    }

    public static CheckoutSession create(MerchantId merchantId, Money amount, String returnUrl) {
        return new CheckoutSession(
                UUID.randomUUID(),
                merchantId,
                amount,
                returnUrl,
                CheckoutSessionStatus.PENDING,
                null,
                Instant.now().plus(30, ChronoUnit.MINUTES), // 30 minutes expiry
                Instant.now()
        );
    }

    public static CheckoutSession reconstitute(UUID id, MerchantId merchantId, Money amount, String returnUrl,
                                               CheckoutSessionStatus status, TransactionId transactionId,
                                               Instant expiresAt, Instant createdAt) {
        return new CheckoutSession(id, merchantId, amount, returnUrl, status, transactionId, expiresAt, createdAt);
    }

    public void markCompleted(TransactionId transactionId) {
        if (this.status.isTerminal()) {
            throw new IllegalStateException("Session is already " + this.status);
        }
        this.status = CheckoutSessionStatus.COMPLETED;
        this.transactionId = Objects.requireNonNull(transactionId);
    }

    public void cancel() {
        if (this.status.isTerminal()) {
            throw new IllegalStateException("Session is already " + this.status);
        }
        this.status = CheckoutSessionStatus.CANCELLED;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public UUID getId() { return id; }
    public MerchantId getMerchantId() { return merchantId; }
    public Money getAmount() { return amount; }
    public String getReturnUrl() { return returnUrl; }
    public CheckoutSessionStatus getStatus() { return status; }
    public TransactionId getTransactionId() { return transactionId; }
    public Instant getExpiresAt() { return expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
}
