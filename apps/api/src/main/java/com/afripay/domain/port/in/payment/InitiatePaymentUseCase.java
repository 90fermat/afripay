package com.afripay.domain.port.in.payment;

import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionType;

import java.util.Map;

public interface InitiatePaymentUseCase {

    Transaction initiate(Command command);

    record Command(
        String merchantId,
        String externalRef,
        String idempotencyKey,
        ProviderType provider,
        TransactionType type,
        long amountMinorUnits,
        String currencyCode,
        String phoneNumber,
        String customerRef,
        Map<String, Object> metadata
    ) {
        public Command {
            if (merchantId == null || merchantId.isBlank())       throw new IllegalArgumentException("merchantId is required");
            if (externalRef == null || externalRef.isBlank())     throw new IllegalArgumentException("externalRef is required");
            if (provider == null)                                  throw new IllegalArgumentException("provider is required");
            if (type == null)                                      throw new IllegalArgumentException("type is required");
            if (amountMinorUnits <= 0)                             throw new IllegalArgumentException("amount must be strictly positive");
            if (currencyCode == null || currencyCode.isBlank())   throw new IllegalArgumentException("currencyCode is required");
            if (phoneNumber == null || phoneNumber.isBlank())      throw new IllegalArgumentException("phoneNumber is required");
        }
    }
}
