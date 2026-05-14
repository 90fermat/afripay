package com.afripay.adapter.out.provider;

import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.port.out.provider.PaymentProviderPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Component
public class MTNMobileMoneyAdapter implements PaymentProviderPort {

    private static final Logger log = LoggerFactory.getLogger(MTNMobileMoneyAdapter.class);
    private final WebClient webClient;

    public MTNMobileMoneyAdapter(WebClient.Builder webClientBuilder) {
        // Scaffolded WebClient for real MTN MoMo API calls
        this.webClient = webClientBuilder
                .baseUrl("https://sandbox.momodeveloper.mtn.com")
                .defaultHeader("Ocp-Apim-Subscription-Key", "TODO_ADD_KEY_TO_PROPERTIES")
                .build();
    }

    @Override
    public String providerId() {
        return ProviderType.MTN_MOMO.name();
    }

    @Override
    public Mono<ProviderResponse> initiatePayment(Transaction transaction) {
        log.info("Initiating MTN MoMo payment for {}", transaction.getId());
        
        // TODO: Map transaction data to MTN MoMo Request Body
        // return webClient.post()
        //     .uri("/collection/v1_0/requesttopay")
        //     .bodyValue(requestBody)
        //     .retrieve()
        //     .bodyToMono(...)
        //     .map(...)
        
        // For now, simulate async pending state as MTN MoMo uses async callbacks
        return Mono.fromSupplier(() -> new ProviderResponse(
            "mtn_momo_" + UUID.randomUUID().toString().substring(0, 8),
            ProviderStatus.PENDING,
            Map.of("message", "Simulated pending response from MTN MoMo API"),
            null
        ));
    }

    @Override
    public Mono<ProviderResponse> checkStatus(String providerTransactionId) {
        log.info("Checking MTN MoMo payment status for {}", providerTransactionId);
        
        // return webClient.get()
        //     .uri("/collection/v1_0/requesttopay/{referenceId}", providerTransactionId)
        //     .retrieve()
        //     .bodyToMono(...)
        //     .map(...)
        
        return Mono.just(new ProviderResponse(
            providerTransactionId,
            ProviderStatus.SUCCESS,
            Map.of("status", "SUCCESSFUL", "simulated", true),
            null
        ));
    }

    @Override
    public Mono<ProviderResponse> refund(String originalProviderTxId, Transaction transaction) {
        log.info("Initiating MTN MoMo refund for {}", originalProviderTxId);
        
        return Mono.just(new ProviderResponse(
            "ref_mtn_" + UUID.randomUUID().toString().substring(0, 8),
            ProviderStatus.SUCCESS,
            Map.of("status", "REFUNDED", "simulated", true),
            null
        ));
    }
}
