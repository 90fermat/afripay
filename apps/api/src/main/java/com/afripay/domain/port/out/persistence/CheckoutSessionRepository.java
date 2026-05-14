package com.afripay.domain.port.out.persistence;

import com.afripay.domain.model.checkout.CheckoutSession;

import java.util.Optional;
import java.util.UUID;

public interface CheckoutSessionRepository {
    CheckoutSession save(CheckoutSession session);
    Optional<CheckoutSession> findById(UUID id);
}
