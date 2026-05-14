package com.afripay.application.service.webhook;

import com.afripay.adapter.out.persistence.entity.MerchantEntity;
import com.afripay.adapter.out.persistence.repository.MerchantJpaRepository;
import com.afripay.domain.model.webhook.WebhookDelivery;
import com.afripay.domain.port.out.persistence.WebhookDeliveryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class WebhookWorker {

    private static final Logger log = LoggerFactory.getLogger(WebhookWorker.class);
    private static final String SIGNATURE_HEADER = "X-AfriDevPay-Signature";
    private static final int BATCH_SIZE = 10;

    private final WebhookDeliveryRepository deliveryRepository;
    private final MerchantJpaRepository merchantRepository;
    private final RestTemplate restTemplate;

    public WebhookWorker(WebhookDeliveryRepository deliveryRepository,
                         MerchantJpaRepository merchantRepository) {
        this.deliveryRepository = deliveryRepository;
        this.merchantRepository = merchantRepository;
        this.restTemplate = new RestTemplate();
    }

    @Scheduled(fixedDelay = 5000)
    public void processWebhooks() {
        List<WebhookDelivery> pendingDeliveries = deliveryRepository.findDeliveriesToRetry(Instant.now(), BATCH_SIZE);

        for (WebhookDelivery delivery : pendingDeliveries) {
            try {
                attemptDelivery(delivery);
            } catch (Exception e) {
                log.error("Unexpected error processing webhook delivery {}: {}", delivery.getId(), e.getMessage());
            }
        }
    }

    private void attemptDelivery(WebhookDelivery delivery) {
        MerchantEntity merchant = merchantRepository.findById(delivery.getMerchantId().getValue())
                .orElse(null);

        if (merchant == null) {
            log.warn("Merchant {} not found. Marking delivery {} as failed.",
                    delivery.getMerchantId(), delivery.getId());
            delivery.markFailed(null);
            deliveryRepository.save(delivery);
            return;
        }

        String url = merchant.getWebhookUrl();
        if (url == null || url.isBlank()) {
            log.debug("Merchant {} has no webhook URL. Marking delivery {} as failed.",
                    merchant.getId(), delivery.getId());
            delivery.markFailed(null);
            deliveryRepository.save(delivery);
            return;
        }

        String secret = merchant.getWebhookSecret();
        String signature = HmacSignatureBuilder.buildSignature(delivery.getPayload(), secret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (signature != null) {
            headers.set(SIGNATURE_HEADER, signature);
        }

        HttpEntity<String> request = new HttpEntity<>(delivery.getPayload(), headers);

        try {
            log.info("Delivering webhook {} to {} (attempt {})",
                    delivery.getEventId(), url, delivery.getAttempts() + 1);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            int statusCode = response.getStatusCode().value();

            if (response.getStatusCode().is2xxSuccessful()) {
                delivery.markSuccess(statusCode);
                log.info("Successfully delivered webhook {}", delivery.getEventId());
            } else {
                delivery.markFailed(statusCode);
                log.warn("Webhook delivery {} returned HTTP {}. Next retry at: {}",
                        delivery.getEventId(), statusCode, delivery.getNextRetryAt());
            }
        } catch (RestClientException e) {
            delivery.markFailed(null);
            log.warn("Webhook delivery {} failed with error: {}. Next retry at: {}",
                    delivery.getEventId(), e.getMessage(), delivery.getNextRetryAt());
        }

        deliveryRepository.save(delivery);
    }
}

