package com.afripay.domain.model.webhook;

import com.afripay.domain.model.merchant.MerchantId;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.UUID;

public class WebhookDelivery {

    private final UUID id;
    private final MerchantId merchantId;
    private final String eventId;
    private final String payload;

    private WebhookDeliveryStatus status;
    private int attempts;
    private Integer lastHttpStatus;
    private Instant nextRetryAt;

    private final Instant createdAt;
    private Instant updatedAt;

    private static final int MAX_RETRIES = 5;

    private WebhookDelivery(UUID id, MerchantId merchantId, String eventId, String payload,
                            WebhookDeliveryStatus status, int attempts, Integer lastHttpStatus,
                            Instant nextRetryAt, Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        this.merchantId = Objects.requireNonNull(merchantId);
        this.eventId = Objects.requireNonNull(eventId);
        this.payload = Objects.requireNonNull(payload);
        this.status = Objects.requireNonNull(status);
        this.attempts = attempts;
        this.lastHttpStatus = lastHttpStatus;
        this.nextRetryAt = Objects.requireNonNull(nextRetryAt);
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
    }

    public static WebhookDelivery create(MerchantId merchantId, String eventId, String payload) {
        Instant now = Instant.now();
        return new WebhookDelivery(
                UUID.randomUUID(), merchantId, eventId, payload,
                WebhookDeliveryStatus.PENDING, 0, null,
                now, now, now
        );
    }

    public static WebhookDelivery reconstitute(UUID id, MerchantId merchantId, String eventId, String payload,
                                               WebhookDeliveryStatus status, int attempts, Integer lastHttpStatus,
                                               Instant nextRetryAt, Instant createdAt, Instant updatedAt) {
        return new WebhookDelivery(id, merchantId, eventId, payload, status, attempts, lastHttpStatus, nextRetryAt, createdAt, updatedAt);
    }

    public void markSuccess(int httpStatus) {
        this.status = WebhookDeliveryStatus.SUCCESS;
        this.lastHttpStatus = httpStatus;
        this.attempts++;
        this.updatedAt = Instant.now();
    }

    public void markFailed(Integer httpStatus) {
        this.attempts++;
        this.lastHttpStatus = httpStatus;
        this.updatedAt = Instant.now();

        if (this.attempts >= MAX_RETRIES) {
            this.status = WebhookDeliveryStatus.FAILED;
            // Push retry far into the future so it's not picked up again
            this.nextRetryAt = Instant.now().plus(365, ChronoUnit.DAYS);
        } else {
            this.status = WebhookDeliveryStatus.PENDING;
            // Exponential backoff: 2 mins, 10 mins, 1 hr, 6 hrs...
            long delayMinutes = (long) Math.pow(5, this.attempts - 1) * 2;
            this.nextRetryAt = Instant.now().plus(delayMinutes, ChronoUnit.MINUTES);
        }
    }

    public UUID getId() { return id; }
    public MerchantId getMerchantId() { return merchantId; }
    public String getEventId() { return eventId; }
    public String getPayload() { return payload; }
    public WebhookDeliveryStatus getStatus() { return status; }
    public int getAttempts() { return attempts; }
    public Integer getLastHttpStatus() { return lastHttpStatus; }
    public Instant getNextRetryAt() { return nextRetryAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
