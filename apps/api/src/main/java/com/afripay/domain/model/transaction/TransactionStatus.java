package com.afripay.domain.model.transaction;

public enum TransactionStatus {
    PENDING, SUCCESS, FAILED, REVERSED, CANCELLED;

    public boolean isTerminal() { return this == SUCCESS || this == FAILED || this == REVERSED || this == CANCELLED; }
    public boolean canBeRefunded() { return this == SUCCESS; }
    public boolean canTransitionTo(TransactionStatus next) {
        return switch (this) {
            case PENDING   -> next == SUCCESS || next == FAILED || next == CANCELLED;
            case SUCCESS   -> next == REVERSED;
            case FAILED, REVERSED, CANCELLED -> false;
        };
    }
}
