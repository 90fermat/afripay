package com.afripay.domain.model.checkout;

public enum CheckoutSessionStatus {
    PENDING,
    COMPLETED,
    CANCELLED,
    EXPIRED;

    public boolean isTerminal() {
        return this != PENDING;
    }
}
