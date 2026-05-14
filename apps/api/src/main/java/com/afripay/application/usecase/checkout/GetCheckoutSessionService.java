package com.afripay.application.usecase.checkout;

import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.port.in.checkout.GetCheckoutSessionUseCase;
import com.afripay.domain.port.out.persistence.CheckoutSessionRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetCheckoutSessionService implements GetCheckoutSessionUseCase {

    private final CheckoutSessionRepository sessionRepository;

    public GetCheckoutSessionService(CheckoutSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public CheckoutSession getSession(UUID sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Checkout Session not found: " + sessionId));
    }
}
