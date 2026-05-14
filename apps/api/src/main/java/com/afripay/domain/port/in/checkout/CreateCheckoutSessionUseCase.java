package com.afripay.domain.port.in.checkout;

import com.afripay.domain.model.checkout.CheckoutSession;

public interface CreateCheckoutSessionUseCase {
    CheckoutSession create(Command command);

    record Command(
        String merchantId,
        long amountMinorUnits,
        String currencyCode,
        String returnUrl
    ) {}
}
