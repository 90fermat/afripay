package com.afripay.domain.model.merchant;

public enum MerchantTier {
    STARTER(100, 1_000),
    GROWTH(1_000, 50_000),
    ENTERPRISE(10_000, Integer.MAX_VALUE);

    private final int requestsPerMinute;
    private final int monthlyTransactionLimit;

    MerchantTier(int requestsPerMinute, int monthlyTransactionLimit) {
        this.requestsPerMinute = requestsPerMinute;
        this.monthlyTransactionLimit = monthlyTransactionLimit;
    }

    public int getRequestsPerMinute() { return requestsPerMinute; }
    public int getMonthlyTransactionLimit() { return monthlyTransactionLimit; }
    public boolean hasUnlimitedTransactions() { return monthlyTransactionLimit == Integer.MAX_VALUE; }
}
