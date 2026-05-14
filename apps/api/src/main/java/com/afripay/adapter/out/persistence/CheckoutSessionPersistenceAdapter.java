package com.afripay.adapter.out.persistence;

import com.afripay.adapter.out.persistence.entity.CheckoutSessionEntity;
import com.afripay.adapter.out.persistence.repository.CheckoutSessionJpaRepository;
import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.model.checkout.CheckoutSessionStatus;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Money;
import com.afripay.domain.model.transaction.TransactionId;
import com.afripay.domain.port.out.persistence.CheckoutSessionRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class CheckoutSessionPersistenceAdapter implements CheckoutSessionRepository {

    private final CheckoutSessionJpaRepository repository;

    public CheckoutSessionPersistenceAdapter(CheckoutSessionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public CheckoutSession save(CheckoutSession session) {
        CheckoutSessionEntity entity = new CheckoutSessionEntity();
        entity.setId(session.getId());
        entity.setMerchantId(session.getMerchantId().getValue());
        entity.setAmountMinorUnits(session.getAmount().amountMinorUnits());
        entity.setCurrencyCode(session.getAmount().currency().getCurrencyCode());
        entity.setReturnUrl(session.getReturnUrl());
        entity.setStatus(session.getStatus().name());
        entity.setTransactionId(session.getTransactionId() != null ? session.getTransactionId().getValue() : null);
        entity.setExpiresAt(session.getExpiresAt());
        entity.setCreatedAt(session.getCreatedAt());

        CheckoutSessionEntity saved = repository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<CheckoutSession> findById(UUID id) {
        return repository.findById(id).map(this::mapToDomain);
    }

    private CheckoutSession mapToDomain(CheckoutSessionEntity entity) {
        return CheckoutSession.reconstitute(
                entity.getId(),
                MerchantId.of(entity.getMerchantId()),
                Money.of(entity.getAmountMinorUnits(), entity.getCurrencyCode()),
                entity.getReturnUrl(),
                CheckoutSessionStatus.valueOf(entity.getStatus()),
                entity.getTransactionId() != null ? TransactionId.of(entity.getTransactionId()) : null,
                entity.getExpiresAt(),
                entity.getCreatedAt()
        );
    }
}
