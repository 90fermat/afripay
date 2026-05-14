package com.afripay.domain.port.in.checkout;

import com.afripay.domain.model.checkout.CheckoutSession;

import java.util.UUID;

public interface GetCheckoutSessionUseCase {
    CheckoutSession getSession(UUID sessionId);
}
