package com.afripay.adapter.out.persistence.repository;

import com.afripay.adapter.out.persistence.entity.CheckoutSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CheckoutSessionJpaRepository extends JpaRepository<CheckoutSessionEntity, UUID> {
}
