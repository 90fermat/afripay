package com.afripay.application.port.in.payment;

import java.math.BigDecimal;
import java.util.Map;

public record InitiatePaymentCommand(
        String merchantId,
        BigDecimal amount,
        String currency,
        String provider, // e.g., "MTN", "ORANGE", "WAVE"
        String customerPhone,
        String returnUrl,
        Map<String, Object> metadata,
        boolean isTestMode
) {
    public InitiatePaymentCommand {
        if (merchantId == null || merchantId.isBlank()) throw new IllegalArgumentException("merchantId is required");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("amount must be positive");
        if (currency == null || currency.isBlank()) throw new IllegalArgumentException("currency is required");
        if (provider == null || provider.isBlank()) throw new IllegalArgumentException("provider is required");
        if (customerPhone == null || customerPhone.isBlank()) throw new IllegalArgumentException("customerPhone is required");
    }
}
