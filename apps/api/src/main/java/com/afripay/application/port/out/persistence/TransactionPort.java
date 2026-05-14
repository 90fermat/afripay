package com.afripay.application.port.out.persistence;

import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;

import com.afripay.domain.model.common.PaginatedResult;
import com.afripay.domain.model.merchant.MerchantId;
import java.util.Optional;

public interface TransactionPort {
    void save(Transaction transaction);
    Optional<Transaction> findById(TransactionId id);
    PaginatedResult<Transaction> findAllByMerchantId(MerchantId merchantId, int page, int size);
}
