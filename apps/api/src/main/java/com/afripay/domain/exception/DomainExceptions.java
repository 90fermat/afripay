package com.afripay.domain.exception;

import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.merchant.MerchantStatus;
import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.model.transaction.TransactionStatus;

public final class DomainExceptions {

    private DomainExceptions() {}

    public static class DomainException extends RuntimeException {
        private final String errorCode;
        public DomainException(String errorCode, String message) { super(message); this.errorCode = errorCode; }
        public DomainException(String errorCode, String message, Throwable cause) { super(message, cause); this.errorCode = errorCode; }
        public String getErrorCode() { return errorCode; }
    }

    public static class InvalidTransactionStateException extends DomainException {
        private final TransactionId transactionId;
        private final TransactionStatus current;
        private final TransactionStatus attempted;
        public InvalidTransactionStateException(TransactionId id, TransactionStatus current, TransactionStatus attempted) {
            super("INVALID_TRANSACTION_STATE", "Transaction %s cannot transition from %s to %s".formatted(id, current, attempted));
            this.transactionId = id; this.current = current; this.attempted = attempted;
        }
        public TransactionId getTransactionId() { return transactionId; }
        public TransactionStatus getCurrent()   { return current; }
        public TransactionStatus getAttempted() { return attempted; }
    }

    public static class TransactionNotFoundException extends DomainException {
        public TransactionNotFoundException(TransactionId id) { super("TRANSACTION_NOT_FOUND", "Transaction not found: " + id); }
        public TransactionNotFoundException(String key) { super("TRANSACTION_NOT_FOUND", "No transaction with idempotency key: " + key); }
    }

    public static class DuplicateTransactionException extends DomainException {
        private final String idempotencyKey;
        public DuplicateTransactionException(String idempotencyKey) {
            super("DUPLICATE_TRANSACTION", "A transaction with idempotency key '%s' already exists".formatted(idempotencyKey));
            this.idempotencyKey = idempotencyKey;
        }
        public String getIdempotencyKey() { return idempotencyKey; }
    }

    public static class TransactionNotRefundableException extends DomainException {
        public TransactionNotRefundableException(TransactionId id, TransactionStatus status) {
            super("TRANSACTION_NOT_REFUNDABLE", "Transaction %s with status %s cannot be refunded".formatted(id, status));
        }
    }

    public static class MerchantNotFoundException extends DomainException {
        public MerchantNotFoundException(MerchantId id) { super("MERCHANT_NOT_FOUND", "Merchant not found: " + id); }
        public MerchantNotFoundException(String email)  { super("MERCHANT_NOT_FOUND", "No merchant with email: " + email); }
    }

    public static class MerchantNotActiveException extends DomainException {
        public MerchantNotActiveException(MerchantId id, MerchantStatus status) {
            super("MERCHANT_NOT_ACTIVE", "Merchant %s is not active (current status: %s)".formatted(id, status));
        }
    }

    public static class DuplicateMerchantException extends DomainException {
        public DuplicateMerchantException(String email) {
            super("DUPLICATE_MERCHANT", "A merchant with email '%s' already exists".formatted(email));
        }
    }

    public static class ProviderUnavailableException extends DomainException {
        public ProviderUnavailableException(String provider, String reason) {
            super("PROVIDER_UNAVAILABLE", "Provider %s is currently unavailable: %s".formatted(provider, reason));
        }
        public ProviderUnavailableException(String provider, Throwable cause) {
            super("PROVIDER_UNAVAILABLE", "Provider %s is currently unavailable".formatted(provider), cause);
        }
    }

    public static class ProviderRejectionException extends DomainException {
        private final String providerCode;
        public ProviderRejectionException(String provider, String providerCode, String message) {
            super("PROVIDER_REJECTED", "Provider %s rejected the request [%s]: %s".formatted(provider, providerCode, message));
            this.providerCode = providerCode;
        }
        public String getProviderCode() { return providerCode; }
    }

    public static class InsufficientFundsException extends DomainException {
        public InsufficientFundsException() { super("INSUFFICIENT_FUNDS", "Customer has insufficient funds to complete this payment"); }
    }

    public static class ApiKeyNotFoundException extends DomainException {
        public ApiKeyNotFoundException() { super("API_KEY_NOT_FOUND", "The provided API key does not exist or has been revoked"); }
    }

    public static class ApiKeyExpiredException extends DomainException {
        public ApiKeyExpiredException() { super("API_KEY_EXPIRED", "The provided API key has expired"); }
    }

    public static class InsufficientScopeException extends DomainException {
        public InsufficientScopeException(String requiredScope) {
            super("INSUFFICIENT_SCOPE", "This API key does not have the required scope: " + requiredScope);
        }
    }

    public static class RateLimitExceededException extends DomainException {
        private final int retryAfterSeconds;
        public RateLimitExceededException(int retryAfterSeconds) {
            super("RATE_LIMIT_EXCEEDED", "Too many requests. Please retry after %d seconds".formatted(retryAfterSeconds));
            this.retryAfterSeconds = retryAfterSeconds;
        }
        public int getRetryAfterSeconds() { return retryAfterSeconds; }
    }
}
