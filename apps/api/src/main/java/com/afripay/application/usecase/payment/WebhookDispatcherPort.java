package com.afripay.application.usecase.payment;

import com.afripay.domain.model.transaction.Transaction;

public interface WebhookDispatcherPort {
    /**
     * Enqueues a webhook delivery for the given transaction event.
     * Fire-and-forget — delivery is retried asynchronously.
     *
     * @param transaction the transaction that triggered the event
     * @param eventType   e.g. "transaction.success", "transaction.failed"
     */
    void dispatch(Transaction transaction, String eventType);
}
