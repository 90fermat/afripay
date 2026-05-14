package com.afripay.application.service.webhook;

import com.afripay.domain.event.TransactionStatusUpdatedEvent;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.webhook.WebhookDelivery;
import com.afripay.domain.port.out.persistence.WebhookDeliveryRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Component
public class WebhookEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(WebhookEventPublisher.class);

    private final ObjectMapper objectMapper;
    private final WebhookDeliveryRepository deliveryRepository;

    public WebhookEventPublisher(ObjectMapper objectMapper, WebhookDeliveryRepository deliveryRepository) {
        this.objectMapper = objectMapper;
        this.deliveryRepository = deliveryRepository;
    }

    @Async
    @EventListener
    public void handleTransactionStatusUpdated(TransactionStatusUpdatedEvent event) {
        Transaction tx = event.transaction();

        // Skip webhooks for pending — only fire on terminal states
        if (tx.isPending()) {
            return;
        }

        String eventId = UUID.randomUUID().toString();

        WebhookPayload payload = new WebhookPayload(
                eventId,
                "payment." + tx.getStatus().name().toLowerCase(),
                tx.getMerchantId().toString(),
                tx.getId().toString(),
                tx.getProvider().name(),
                tx.getStatus().name(),
                BigDecimal.valueOf(tx.getAmount().amountMinorUnits()),
                tx.getAmount().currency().getCurrencyCode(),
                tx.getMetadata(),
                Instant.now()
        );

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            MerchantId merchantId = tx.getMerchantId();

            WebhookDelivery delivery = WebhookDelivery.create(merchantId, eventId, jsonPayload);
            deliveryRepository.save(delivery);

            log.info("Queued webhook delivery {} for merchant {}", eventId, merchantId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize webhook payload for tx {}: {}", tx.getId(), e.getMessage());
        }
    }
}
