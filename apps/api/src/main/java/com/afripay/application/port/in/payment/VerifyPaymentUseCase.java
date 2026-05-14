package com.afripay.application.port.in.payment;

import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;

public interface VerifyPaymentUseCase {
    Transaction verifyPayment(String merchantId, TransactionId transactionId);
}
