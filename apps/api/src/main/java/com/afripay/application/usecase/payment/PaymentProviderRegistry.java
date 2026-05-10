package com.afripay.application.usecase.payment;

import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.port.out.provider.PaymentProviderPort;

public interface PaymentProviderRegistry {
    PaymentProviderPort getProvider(ProviderType type);
}
