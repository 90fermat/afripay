package com.afripay.domain.model.transaction;

import java.util.Objects;
import java.util.UUID;

public record TransactionId(UUID value) {
    public TransactionId {
        Objects.requireNonNull(value);
    }
    public static TransactionId generate() { return new TransactionId(UUID.randomUUID()); }
    public static TransactionId of(UUID value) { return new TransactionId(value); }
    public static TransactionId of(String value) {
        try { return new TransactionId(UUID.fromString(value)); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("Invalid TransactionId format: " + value, e); }
    }
    public UUID getValue() { return value; } // kept for backwards compatibility
    @Override public String toString() { return value.toString(); }
}
