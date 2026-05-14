package com.afripay.domain.port.out.persistence;

import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.model.transaction.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TransactionRepository {
    Transaction save(Transaction transaction);
    Optional<Transaction> findById(TransactionId id);
    Optional<Transaction> findByIdAndMerchantId(TransactionId id, MerchantId merchantId);
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    Optional<Transaction> findByExternalRef(String externalRef, MerchantId merchantId);
    Page<Transaction> findByMerchantId(MerchantId merchantId, Pageable pageable);
    Page<Transaction> findByMerchantIdAndStatus(MerchantId merchantId, TransactionStatus status, Pageable pageable);
    boolean existsByIdempotencyKey(String idempotencyKey);
}
