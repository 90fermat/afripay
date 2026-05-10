package com.afripay.domain.model.transaction;

import com.afripay.domain.exception.InvalidTransactionStateException;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.provider.ProviderType;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Transaction {

    private final TransactionId id;
    private final MerchantId merchantId;
    private final String externalRef;
    private final String idempotencyKey;
    private final ProviderType provider;
    private final TransactionType type;
    private final Money amount;
    private final String phoneNumber;
    private final String customerRef;
    private final Map<String, Object> metadata;

    private TransactionStatus status;
    private String providerTransactionId;
    private Map<String, Object> providerResponse;
    private String failureReason;

    private final Instant createdAt;
    private Instant updatedAt;

    Transaction(TransactionId id, MerchantId merchantId, String externalRef, String idempotencyKey,
                ProviderType provider, TransactionType type, Money amount, String phoneNumber,
                String customerRef, Map<String, Object> metadata, Instant createdAt) {
        this.id             = Objects.requireNonNull(id);
        this.merchantId     = Objects.requireNonNull(merchantId);
        this.externalRef    = Objects.requireNonNull(externalRef);
        this.idempotencyKey = idempotencyKey;
        this.provider       = Objects.requireNonNull(provider);
        this.type           = Objects.requireNonNull(type);
        this.amount         = Objects.requireNonNull(amount);
        this.phoneNumber    = Objects.requireNonNull(phoneNumber);
        this.customerRef    = customerRef;
        this.metadata       = metadata != null ? new HashMap<>(metadata) : new HashMap<>();
        this.status         = TransactionStatus.PENDING;
        this.createdAt      = Objects.requireNonNull(createdAt);
        this.updatedAt      = createdAt;
        validateAmount();
    }

    public static Transaction create(MerchantId merchantId, String externalRef, String idempotencyKey,
                                     ProviderType provider, TransactionType type, Money amount,
                                     String phoneNumber, String customerRef, Map<String, Object> metadata) {
        return new Transaction(TransactionId.generate(), merchantId, externalRef, idempotencyKey,
            provider, type, amount, phoneNumber, customerRef, metadata, Instant.now());
    }

    public void markSuccess(String providerTransactionId, Map<String, Object> providerResponse) {
        assertCanTransitionTo(TransactionStatus.SUCCESS);
        this.status = TransactionStatus.SUCCESS;
        this.providerTransactionId = providerTransactionId;
        this.providerResponse = providerResponse != null ? new HashMap<>(providerResponse) : null;
        this.updatedAt = Instant.now();
    }

    public void markFailed(String reason, Map<String, Object> providerResponse) {
        assertCanTransitionTo(TransactionStatus.FAILED);
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
        this.providerResponse = providerResponse != null ? new HashMap<>(providerResponse) : null;
        this.updatedAt = Instant.now();
    }

    public void markReversed() {
        assertCanTransitionTo(TransactionStatus.REVERSED);
        this.status = TransactionStatus.REVERSED;
        this.updatedAt = Instant.now();
    }

    public void cancel() {
        assertCanTransitionTo(TransactionStatus.CANCELLED);
        this.status = TransactionStatus.CANCELLED;
        this.updatedAt = Instant.now();
    }

    public boolean canBeRefunded() { return status.canBeRefunded(); }
    public boolean isPending()     { return status == TransactionStatus.PENDING; }
    public boolean isTerminal()    { return status.isTerminal(); }

    private void assertCanTransitionTo(TransactionStatus next) {
        if (!status.canTransitionTo(next))
            throw new InvalidTransactionStateException(id, status, next);
    }

    private void validateAmount() {
        if (amount.isZero())
            throw new IllegalArgumentException("Transaction amount must be strictly positive, got zero for tx: " + id);
    }

    public TransactionId getId()                     { return id; }
    public MerchantId getMerchantId()                { return merchantId; }
    public String getExternalRef()                   { return externalRef; }
    public String getIdempotencyKey()                { return idempotencyKey; }
    public ProviderType getProvider()                { return provider; }
    public TransactionType getType()                 { return type; }
    public TransactionStatus getStatus()             { return status; }
    public Money getAmount()                         { return amount; }
    public String getPhoneNumber()                   { return phoneNumber; }
    public String getCustomerRef()                   { return customerRef; }
    public String getProviderTransactionId()         { return providerTransactionId; }
    public String getFailureReason()                 { return failureReason; }
    public Instant getCreatedAt()                    { return createdAt; }
    public Instant getUpdatedAt()                    { return updatedAt; }
    public Map<String, Object> getMetadata()         { return Collections.unmodifiableMap(metadata); }
    public Map<String, Object> getProviderResponse() {
        return providerResponse != null ? Collections.unmodifiableMap(providerResponse) : null;
    }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Transaction that)) return false; return id.equals(that.id); }
    @Override public int hashCode() { return Objects.hash(id); }
    @Override public String toString() { return "Transaction{id=%s, merchant=%s, provider=%s, amount=%s, status=%s}".formatted(id, merchantId, provider, amount, status); }
}
