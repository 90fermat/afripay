package com.afripay.adapter.out.persistence;

import com.afripay.adapter.out.persistence.entity.MerchantEntity;
import com.afripay.adapter.out.persistence.repository.MerchantJpaRepository;
import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

import com.afripay.application.port.out.persistence.MerchantPort;

@Component
public class MerchantPersistenceAdapter implements MerchantPort {

    private final MerchantJpaRepository repository;

    public MerchantPersistenceAdapter(MerchantJpaRepository repository) {
        this.repository = repository;
    }

    public void save(Merchant merchant) {
        MerchantEntity entity = toEntity(merchant);
        repository.save(entity);
    }

    public Optional<Merchant> findById(MerchantId id) {
        return repository.findById(id.getValue()).map(this::toDomain);
    }

    public Optional<Merchant> findByEmail(String email) {
        return repository.findByEmail(email).map(this::toDomain);
    }

    private MerchantEntity toEntity(Merchant merchant) {
        MerchantEntity entity = new MerchantEntity();
        entity.setId(merchant.getId().getValue());
        entity.setName(merchant.getName());
        entity.setBusinessName(merchant.getBusinessName());
        entity.setEmail(merchant.getEmail());
        entity.setPhoneNumber(merchant.getPhoneNumber());
        entity.setCountryCode(merchant.getCountryCode());
        entity.setStatus(merchant.getStatus());
        entity.setTier(merchant.getTier());
        entity.setWebhookUrl(merchant.getWebhookUrl());
        entity.setWebhookSecret(merchant.getWebhookSecret());
        entity.setCreatedAt(merchant.getCreatedAt());
        entity.setUpdatedAt(merchant.getUpdatedAt());
        return entity;
    }

    private Merchant toDomain(MerchantEntity entity) {
        return Merchant.reconstitute(
                MerchantId.of(entity.getId()),
                entity.getName(),
                entity.getBusinessName(),
                entity.getEmail(),
                entity.getPhoneNumber(),
                entity.getCountryCode(),
                entity.getStatus(),
                entity.getTier(),
                entity.getWebhookUrl(),
                entity.getWebhookSecret(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
