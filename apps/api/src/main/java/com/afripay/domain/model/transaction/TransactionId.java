package com.afripay.domain.model.transaction;

import java.util.Objects;
import java.util.UUID;

public final class TransactionId {
    private final UUID value;
    private TransactionId(UUID value) { this.value = Objects.requireNonNull(value); }
    public static TransactionId generate() { return new TransactionId(UUID.randomUUID()); }
    public static TransactionId of(UUID value) { return new TransactionId(value); }
    public static TransactionId of(String value) {
        try { return new TransactionId(UUID.fromString(value)); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("Invalid TransactionId format: " + value, e); }
    }
    public UUID getValue() { return value; }
    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof TransactionId that)) return false; return value.equals(that.value); }
    @Override public int hashCode() { return Objects.hash(value); }
    @Override public String toString() { return value.toString(); }
}
