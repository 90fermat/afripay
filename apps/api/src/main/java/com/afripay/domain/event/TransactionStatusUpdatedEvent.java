package com.afripay.domain.event;

import com.afripay.domain.model.transaction.Transaction;

public record TransactionStatusUpdatedEvent(
        Transaction transaction
) {}
