package com.afripay.domain.model.apikey;

public enum ApiKeyScope {
    PAYMENTS_READ,
    PAYMENTS_WRITE,
    REFUNDS_WRITE,
    WEBHOOKS_READ,
    WEBHOOKS_WRITE,
    APIKEYS_READ,
    APIKEYS_WRITE,
    MERCHANT_READ,
    MERCHANT_WRITE;

    @Override
    public String toString() {
        return name().toLowerCase().replace('_', ':');
    }
}
