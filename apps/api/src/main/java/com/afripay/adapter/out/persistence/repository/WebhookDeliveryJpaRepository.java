package com.afripay.adapter.out.persistence.repository;

import com.afripay.adapter.out.persistence.entity.WebhookDeliveryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface WebhookDeliveryJpaRepository extends JpaRepository<WebhookDeliveryEntity, UUID> {
    
    @Query("SELECT w FROM WebhookDeliveryEntity w WHERE w.status = :status AND w.nextRetryAt <= :now ORDER BY w.nextRetryAt ASC")
    List<WebhookDeliveryEntity> findDeliveriesToRetry(@Param("status") String status, @Param("now") Instant now, Pageable pageable);

    Page<WebhookDeliveryEntity> findAllByMerchantIdOrderByCreatedAtDesc(UUID merchantId, Pageable pageable);
}
