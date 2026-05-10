package com.afripay.domain.model.merchant;

import java.util.Objects;
import java.util.UUID;

public final class MerchantId {
    private final UUID value;
    private MerchantId(UUID value) { this.value = Objects.requireNonNull(value, "MerchantId value must not be null"); }
    public static MerchantId generate() { return new MerchantId(UUID.randomUUID()); }
    public static MerchantId of(UUID value) { return new MerchantId(value); }
    public static MerchantId of(String value) {
        try { return new MerchantId(UUID.fromString(value)); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("Invalid MerchantId format: " + value, e); }
    }
    public UUID getValue() { return value; }
    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof MerchantId that)) return false; return value.equals(that.value); }
    @Override public int hashCode() { return Objects.hash(value); }
    @Override public String toString() { return value.toString(); }
}
