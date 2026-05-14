package com.afripay.domain.port.in.checkout;

import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.model.provider.ProviderType;

import java.util.UUID;

public interface SubmitCheckoutSessionUseCase {
    CheckoutSession submit(Command command);

    record Command(
        UUID sessionId,
        ProviderType provider,
        String phoneNumber
    ) {}
}
