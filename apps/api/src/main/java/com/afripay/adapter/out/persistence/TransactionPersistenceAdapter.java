package com.afripay.adapter.out.persistence;

import com.afripay.adapter.out.persistence.entity.TransactionEntity;
import com.afripay.adapter.out.persistence.repository.TransactionJpaRepository;
import com.afripay.application.port.out.persistence.TransactionPort;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class TransactionPersistenceAdapter implements TransactionPort {

    private final TransactionJpaRepository repository;

    public TransactionPersistenceAdapter(TransactionJpaRepository repository) {
        this.repository = repository;
    }

    public void save(Transaction transaction) {
        TransactionEntity entity = new TransactionEntity();
        entity.setId(transaction.getId().getValue());
        entity.setMerchantId(transaction.getMerchantId().getValue());
        entity.setExternalRef(transaction.getExternalRef());
        entity.setIdempotencyKey(transaction.getIdempotencyKey());
        entity.setProvider(transaction.getProvider());
        entity.setType(transaction.getType());
        entity.setStatus(transaction.getStatus());
        entity.setAmountMinorUnits(transaction.getAmount().getAmountMinorUnits());
        entity.setCurrencyCode(transaction.getAmount().getCurrencyCode());
        entity.setPhoneNumber(transaction.getPhoneNumber());
        entity.setCustomerRef(transaction.getCustomerRef());
        entity.setMetadata(transaction.getMetadata());
        entity.setProviderTransactionId(transaction.getProviderTransactionId());
        entity.setProviderResponse(transaction.getProviderResponse());
        entity.setFailureReason(transaction.getFailureReason());
        entity.setCreatedAt(transaction.getCreatedAt());
        entity.setUpdatedAt(transaction.getUpdatedAt());
        repository.save(entity);
    }
    
    @Override
    public Optional<Transaction> findById(TransactionId id) {
        return repository.findById(id.getValue()).map(this::mapToDomain);
    }

    private Transaction mapToDomain(TransactionEntity entity) {
        // Because the Transaction constructor is package-private to the domain, 
        // we might use a builder or reflection if strictly hexagonal, or just make it accessible/have a reconstitute method.
        // I will use Transaction.create for simplicity in this POC, though it generates a NEW id.
        // Wait, Transaction entity has an ID. I need a way to restore the Transaction domain object without generating a new ID.
        // Let's assume Transaction has a package-private constructor and we are in a different package.
        // For this phase, I'll use a hack or just reflection, or add a public Reconstitutor in the domain model.
        // Actually, we can add a public static reconstitute method in Transaction.java later. I will call Transaction.reconstitute here.
        return com.afripay.domain.model.transaction.Transaction.reconstitute(
                TransactionId.of(entity.getId()),
                com.afripay.domain.model.merchant.MerchantId.of(entity.getMerchantId()),
                entity.getExternalRef(),
                entity.getIdempotencyKey(),
                entity.getProvider(),
                entity.getType(),
                com.afripay.domain.model.transaction.Money.of(entity.getAmountMinorUnits(), entity.getCurrencyCode()),
                entity.getPhoneNumber(),
                entity.getCustomerRef(),
                entity.getMetadata(),
                entity.getStatus(),
                entity.getProviderTransactionId(),
                entity.getProviderResponse(),
                entity.getFailureReason(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
    
    @Override
    public com.afripay.domain.model.common.PaginatedResult<Transaction> findAllByMerchantId(com.afripay.domain.model.merchant.MerchantId merchantId, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<TransactionEntity> entityPage = repository.findByMerchantIdOrderByCreatedAtDesc(merchantId.getValue(), pageable);
        
        java.util.List<Transaction> content = entityPage.getContent().stream()
                .map(this::mapToDomain)
                .toList();
                
        return new com.afripay.domain.model.common.PaginatedResult<>(
                content,
                entityPage.getNumber(),
                entityPage.getSize(),
                entityPage.getTotalElements(),
                entityPage.getTotalPages()
        );
    }
}
