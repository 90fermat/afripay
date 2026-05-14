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
public class OrangeMoneyAdapter implements PaymentProviderPort {

    private static final Logger log = LoggerFactory.getLogger(OrangeMoneyAdapter.class);
    private final WebClient webClient;

    public OrangeMoneyAdapter(WebClient.Builder webClientBuilder) {
        // Scaffolded WebClient for real Orange Money API calls
        this.webClient = webClientBuilder
                .baseUrl("https://api.orange.com/orange-money-webpay/dev/v1")
                .defaultHeader("Authorization", "Bearer TODO_ADD_TOKEN_TO_PROPERTIES")
                .build();
    }

    @Override
    public String providerId() {
        return ProviderType.ORANGE_MONEY.name();
    }

    @Override
    public Mono<ProviderResponse> initiatePayment(Transaction transaction) {
        log.info("Initiating Orange Money payment for {}", transaction.getId());
        
        // TODO: Map transaction data to Orange Money Web Payment Request Body
        // return webClient.post()
        //     .uri("/webpayment")
        //     .bodyValue(requestBody)
        //     .retrieve()
        //     .bodyToMono(...)
        //     .map(...)
        
        // For now, simulate async pending state 
        return Mono.fromSupplier(() -> new ProviderResponse(
            "om_" + UUID.randomUUID().toString().substring(0, 8),
            ProviderStatus.PENDING,
            Map.of("message", "Simulated pending response from Orange Money API", "payment_url", "https://sandbox.orange.com/pay/simulated"),
            null
        ));
    }

    @Override
    public Mono<ProviderResponse> checkStatus(String providerTransactionId) {
        log.info("Checking Orange Money payment status for {}", providerTransactionId);
        
        // return webClient.post()
        //     .uri("/transactionstatus")
        //     .bodyValue(statusRequest)
        //     .retrieve()
        //     .bodyToMono(...)
        //     .map(...)
        
        return Mono.just(new ProviderResponse(
            providerTransactionId,
            ProviderStatus.SUCCESS,
            Map.of("status", "SUCCESS", "simulated", true),
            null
        ));
    }

    @Override
    public Mono<ProviderResponse> refund(String originalProviderTxId, Transaction transaction) {
        log.info("Initiating Orange Money refund for {}", originalProviderTxId);
        
        return Mono.just(new ProviderResponse(
            "ref_om_" + UUID.randomUUID().toString().substring(0, 8),
            ProviderStatus.SUCCESS,
            Map.of("status", "REFUNDED", "simulated", true),
            null
        ));
    }
}
