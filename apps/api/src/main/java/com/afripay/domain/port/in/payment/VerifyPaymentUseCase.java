package com.afripay.domain.port.in.payment;

import com.afripay.domain.model.transaction.Transaction;

public interface VerifyPaymentUseCase {
    Transaction verify(String transactionId, String merchantId);
}
