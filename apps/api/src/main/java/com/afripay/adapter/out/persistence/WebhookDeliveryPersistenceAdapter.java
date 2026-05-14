package com.afripay.adapter.out.persistence;

import com.afripay.adapter.out.persistence.entity.WebhookDeliveryEntity;
import com.afripay.adapter.out.persistence.repository.WebhookDeliveryJpaRepository;
import com.afripay.domain.model.common.PaginatedResult;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.webhook.WebhookDelivery;
import com.afripay.domain.model.webhook.WebhookDeliveryStatus;
import com.afripay.domain.port.out.persistence.WebhookDeliveryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class WebhookDeliveryPersistenceAdapter implements WebhookDeliveryRepository {

    private final WebhookDeliveryJpaRepository repository;

    public WebhookDeliveryPersistenceAdapter(WebhookDeliveryJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public WebhookDelivery save(WebhookDelivery delivery) {
        WebhookDeliveryEntity entity = toEntity(delivery);
        WebhookDeliveryEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<WebhookDelivery> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<WebhookDelivery> findDeliveriesToRetry(Instant now, int limit) {
        return repository.findDeliveriesToRetry("PENDING", now, PageRequest.of(0, limit))
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public PaginatedResult<WebhookDelivery> findAllByMerchantId(MerchantId merchantId, int page, int size) {
        Page<WebhookDeliveryEntity> result = repository.findAllByMerchantIdOrderByCreatedAtDesc(
                merchantId.getValue(), PageRequest.of(page, size));
        return new PaginatedResult<>(
                result.getContent().stream().map(this::toDomain).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    private WebhookDeliveryEntity toEntity(WebhookDelivery d) {
        WebhookDeliveryEntity e = new WebhookDeliveryEntity();
        e.setId(d.getId());
        e.setMerchantId(d.getMerchantId().getValue());
        e.setEventId(d.getEventId());
        e.setPayload(d.getPayload());
        e.setStatus(d.getStatus().name());
        e.setAttempts(d.getAttempts());
        e.setLastHttpStatus(d.getLastHttpStatus());
        e.setNextRetryAt(d.getNextRetryAt());
        e.setCreatedAt(d.getCreatedAt());
        e.setUpdatedAt(d.getUpdatedAt());
        return e;
    }

    private WebhookDelivery toDomain(WebhookDeliveryEntity e) {
        return WebhookDelivery.reconstitute(
                e.getId(),
                MerchantId.of(e.getMerchantId()),
                e.getEventId(),
                e.getPayload(),
                WebhookDeliveryStatus.valueOf(e.getStatus()),
                e.getAttempts(),
                e.getLastHttpStatus(),
                e.getNextRetryAt(),
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }
}
