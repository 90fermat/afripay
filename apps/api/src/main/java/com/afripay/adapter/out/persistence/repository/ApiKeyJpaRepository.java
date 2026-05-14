package com.afripay.adapter.out.persistence.repository;

import com.afripay.adapter.out.persistence.entity.ApiKeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ApiKeyJpaRepository extends JpaRepository<ApiKeyEntity, UUID> {
    Optional<ApiKeyEntity> findByKeyHash(String keyHash);
    java.util.List<ApiKeyEntity> findByMerchantIdAndIsActiveTrue(UUID merchantId);
    java.util.List<ApiKeyEntity> findByMerchantIdAndEnvironmentAndIsActiveTrue(UUID merchantId, String environment);
}
