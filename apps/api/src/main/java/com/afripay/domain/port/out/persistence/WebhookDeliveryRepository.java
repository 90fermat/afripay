package com.afripay.domain.port.out.persistence;

import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.webhook.WebhookDelivery;
import com.afripay.domain.model.common.PaginatedResult;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WebhookDeliveryRepository {
    WebhookDelivery save(WebhookDelivery delivery);
    Optional<WebhookDelivery> findById(UUID id);
    List<WebhookDelivery> findDeliveriesToRetry(Instant now, int limit);
    PaginatedResult<WebhookDelivery> findAllByMerchantId(MerchantId merchantId, int page, int size);
}
