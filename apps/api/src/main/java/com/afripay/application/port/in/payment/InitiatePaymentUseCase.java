package com.afripay.application.port.in.payment;

import com.afripay.domain.model.transaction.Transaction;

public interface InitiatePaymentUseCase {
    Transaction initiatePayment(InitiatePaymentCommand command);
}
