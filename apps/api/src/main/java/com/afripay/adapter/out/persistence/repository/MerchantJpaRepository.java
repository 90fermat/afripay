package com.afripay.adapter.out.persistence.repository;

import com.afripay.adapter.out.persistence.entity.MerchantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MerchantJpaRepository extends JpaRepository<MerchantEntity, UUID> {
    Optional<MerchantEntity> findByEmail(String email);
}
