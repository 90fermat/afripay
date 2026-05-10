package com.afripay.domain.exception;

import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.model.transaction.TransactionStatus;

public class InvalidTransactionStateException extends DomainExceptions.InvalidTransactionStateException {
    public InvalidTransactionStateException(TransactionId id, TransactionStatus current, TransactionStatus attempted) {
        super(id, current, attempted);
    }
}
