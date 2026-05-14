package com.afripay.domain.port.out.provider;

import com.afripay.domain.model.transaction.Transaction;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface PaymentProviderPort {

    String providerId();

    Mono<ProviderResponse> initiatePayment(Transaction transaction);

    Mono<ProviderResponse> checkStatus(String providerTransactionId);

    Mono<ProviderResponse> refund(String originalProviderTxId, Transaction transaction);

    record ProviderResponse(
        String providerTransactionId,
        ProviderStatus status,
        Map<String, Object> rawResponse,
        String failureReason
    ) {
        public boolean isSuccess() { return status == ProviderStatus.SUCCESS; }
        public boolean isPending() { return status == ProviderStatus.PENDING; }
        public boolean isFailed()  { return status == ProviderStatus.FAILED; }
    }

    enum ProviderStatus {
        PENDING,
        SUCCESS,
        FAILED
    }
}
