package com.afripay.domain.port.in.payment;

import com.afripay.domain.model.transaction.Transaction;

public interface RefundPaymentUseCase {

    Transaction refund(Command command);

    record Command(
        String originalTransactionId,
        String merchantId,
        String idempotencyKey,
        String reason
    ) {
        public Command {
            if (originalTransactionId == null || originalTransactionId.isBlank())
                throw new IllegalArgumentException("originalTransactionId is required");
            if (merchantId == null || merchantId.isBlank())
                throw new IllegalArgumentException("merchantId is required");
        }
    }
}
