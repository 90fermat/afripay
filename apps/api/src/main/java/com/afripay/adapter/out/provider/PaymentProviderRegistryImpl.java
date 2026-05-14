package com.afripay.adapter.out.provider;

import com.afripay.application.usecase.payment.PaymentProviderRegistry;
import com.afripay.domain.exception.DomainExceptions.ProviderUnavailableException;
import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.port.out.provider.PaymentProviderPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PaymentProviderRegistryImpl implements PaymentProviderRegistry {

    private final Map<String, PaymentProviderPort> providers;

    public PaymentProviderRegistryImpl(List<PaymentProviderPort> providerList) {
        this.providers = providerList.stream()
                .collect(Collectors.toMap(
                        PaymentProviderPort::providerId,
                        provider -> provider
                ));
    }

    @Override
    public PaymentProviderPort getProvider(ProviderType type) {
        PaymentProviderPort provider = providers.get(type.name());
        if (provider == null) {
            throw new ProviderUnavailableException(type.name(), new RuntimeException("No provider found for: " + type));
        }
        return provider;
    }
}

