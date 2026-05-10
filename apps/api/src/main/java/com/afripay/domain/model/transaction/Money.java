package com.afripay.domain.model.transaction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Objects;

public final class Money {

    private final long amountMinorUnits;
    private final Currency currency;

    private Money(long amountMinorUnits, Currency currency) {
        if (amountMinorUnits < 0) {
            throw new IllegalArgumentException("Monetary amount cannot be negative: " + amountMinorUnits);
        }
        this.amountMinorUnits = amountMinorUnits;
        this.currency = Objects.requireNonNull(currency, "Currency must not be null");
    }

    public static Money of(long amountMinorUnits, String currencyCode) {
        return new Money(amountMinorUnits, Currency.getInstance(currencyCode));
    }

    public static Money of(BigDecimal amount, String currencyCode) {
        Currency currency = Currency.getInstance(currencyCode);
        int fractionDigits = currency.getDefaultFractionDigits();
        long minorUnits = amount
            .multiply(BigDecimal.TEN.pow(fractionDigits))
            .setScale(0, RoundingMode.HALF_UP)
            .longValueExact();
        return new Money(minorUnits, currency);
    }

    public static Money zero(String currencyCode) {
        return new Money(0L, Currency.getInstance(currencyCode));
    }

    public long getAmountMinorUnits() { return amountMinorUnits; }
    public Currency getCurrency() { return currency; }
    public String getCurrencyCode() { return currency.getCurrencyCode(); }

    public BigDecimal toMajorUnits() {
        int fractionDigits = currency.getDefaultFractionDigits();
        return BigDecimal.valueOf(amountMinorUnits)
            .divide(BigDecimal.TEN.pow(fractionDigits), fractionDigits, RoundingMode.HALF_UP);
    }

    public Money add(Money other) {
        assertSameCurrency(other);
        return new Money(Math.addExact(this.amountMinorUnits, other.amountMinorUnits), currency);
    }

    public Money subtract(Money other) {
        assertSameCurrency(other);
        long result = Math.subtractExact(this.amountMinorUnits, other.amountMinorUnits);
        if (result < 0) throw new IllegalArgumentException("Subtraction would result in negative amount");
        return new Money(result, currency);
    }

    public boolean isGreaterThan(Money other) { assertSameCurrency(other); return this.amountMinorUnits > other.amountMinorUnits; }
    public boolean isGreaterThanOrEqual(Money other) { assertSameCurrency(other); return this.amountMinorUnits >= other.amountMinorUnits; }
    public boolean isZero() { return amountMinorUnits == 0L; }

    private void assertSameCurrency(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalArgumentException("Currency mismatch: %s vs %s".formatted(this.currency, other.currency));
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money money)) return false;
        return amountMinorUnits == money.amountMinorUnits && currency.equals(money.currency);
    }
    @Override public int hashCode() { return Objects.hash(amountMinorUnits, currency); }
    @Override public String toString() { return toMajorUnits().toPlainString() + " " + getCurrencyCode(); }
}
