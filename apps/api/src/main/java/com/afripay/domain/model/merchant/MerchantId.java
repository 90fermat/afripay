package com.afripay.domain.model.merchant;

import java.util.Objects;
import java.util.UUID;

public record MerchantId(UUID value) {
    public MerchantId {
        Objects.requireNonNull(value, "MerchantId value must not be null");
    }
    public static MerchantId generate() { return new MerchantId(UUID.randomUUID()); }
    public static MerchantId of(UUID value) { return new MerchantId(value); }
    public static MerchantId of(String value) {
        try { return new MerchantId(UUID.fromString(value)); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("Invalid MerchantId format: " + value, e); }
    }
    public UUID getValue() { return value; } // kept for backwards compatibility
    @Override public String toString() { return value.toString(); }
}
