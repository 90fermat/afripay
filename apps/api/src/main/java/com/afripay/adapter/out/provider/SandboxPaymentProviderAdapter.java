package com.afripay.adapter.out.provider;

import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.port.out.provider.PaymentProviderPort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class SandboxPaymentProviderAdapter implements PaymentProviderPort {

    @Override
    public String providerId() {
        return ProviderType.SANDBOX.name();
    }

    @Override
    public Mono<ProviderResponse> initiatePayment(Transaction transaction) {
        return Mono.fromSupplier(() -> {
            BigDecimal amount = transaction.getAmount().toMajorUnits();
            String simulatedProviderId = "txn_sandbox_" + UUID.randomUUID().toString().substring(0, 8);

            // Magic amount 500.00 fails
            if (amount.compareTo(new BigDecimal("500.00")) == 0 || amount.compareTo(new BigDecimal("500")) == 0) {
                return new ProviderResponse(
                    simulatedProviderId,
                    ProviderStatus.FAILED,
                    Map.of("sandbox_reason", "Magic amount triggered failure"),
                    "insufficient_funds"
                );
            }

            return new ProviderResponse(
                simulatedProviderId,
                ProviderStatus.SUCCESS,
                Map.of("sandbox_status", "successful", "simulated_network", transaction.getProvider().name()),
                null
            );
        });
    }

    @Override
    public Mono<ProviderResponse> checkStatus(String providerTransactionId) {
        return Mono.just(new ProviderResponse(
            providerTransactionId,
            ProviderStatus.SUCCESS,
            Map.of("sandbox_status", "verified"),
            null
        ));
    }

    @Override
    public Mono<ProviderResponse> refund(String originalProviderTxId, Transaction transaction) {
        return Mono.just(new ProviderResponse(
            "ref_sandbox_" + UUID.randomUUID().toString().substring(0, 8),
            ProviderStatus.SUCCESS,
            Map.of("sandbox_status", "refunded", "original_tx", originalProviderTxId),
            null
        ));
    }
}
