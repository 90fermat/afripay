package com.afripay.application.service.webhook;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

public record WebhookPayload(
        String eventId,
        String eventType,
        String merchantId,
        String transactionId,
        String provider,
        String status,
        BigDecimal amount,
        String currency,
        Map<String, Object> metadata,
        Instant timestamp
) {}
