package com.afripay.application.port.in.payment;

import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;

public interface RefundPaymentUseCase {
    Transaction refundPayment(String merchantId, TransactionId transactionId, String reason);
}
