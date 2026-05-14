package com.afripay.adapter.out.persistence.repository;

import com.afripay.adapter.out.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, UUID> {
    Optional<TransactionEntity> findByIdempotencyKeyAndMerchantId(String idempotencyKey, UUID merchantId);
    Optional<TransactionEntity> findByExternalRefAndMerchantId(String externalRef, UUID merchantId);
    Page<TransactionEntity> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId, Pageable pageable);
}
