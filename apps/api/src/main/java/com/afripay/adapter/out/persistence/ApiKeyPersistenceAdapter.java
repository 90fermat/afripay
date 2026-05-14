package com.afripay.adapter.out.persistence;

import com.afripay.adapter.out.persistence.entity.ApiKeyEntity;
import com.afripay.adapter.out.persistence.repository.ApiKeyJpaRepository;
import com.afripay.domain.model.apikey.ApiKey;
import com.afripay.domain.model.merchant.MerchantId;
import org.springframework.stereotype.Component;

import java.util.Optional;

import com.afripay.application.port.out.persistence.ApiKeyPort;

@Component
public class ApiKeyPersistenceAdapter implements ApiKeyPort {

    private final ApiKeyJpaRepository repository;

    public ApiKeyPersistenceAdapter(ApiKeyJpaRepository repository) {
        this.repository = repository;
    }

    public void save(ApiKey apiKey) {
        ApiKeyEntity entity = new ApiKeyEntity();
        entity.setId(apiKey.getId());
        entity.setMerchantId(apiKey.getMerchantId().getValue());
        entity.setKeyHash(apiKey.getKeyHash());
        entity.setKeyPrefix(apiKey.getKeyPrefix());
        entity.setName(apiKey.getName());
        entity.setScopes(apiKey.getScopes());
        entity.setEnvironment(apiKey.getEnvironment());
        entity.setActive(apiKey.isActive());
        entity.setLastUsedAt(apiKey.getLastUsedAt());
        entity.setExpiresAt(apiKey.getExpiresAt());
        entity.setCreatedAt(apiKey.getCreatedAt());
        repository.save(entity);
    }

    @Override
    public java.util.List<ApiKey> findByMerchantIdAndActiveTrue(MerchantId merchantId) {
        return repository.findByMerchantIdAndIsActiveTrue(merchantId.getValue()).stream()
                .map(entity -> ApiKey.reconstitute(
                        entity.getId(),
                        MerchantId.of(entity.getMerchantId()),
                        entity.getKeyHash(),
                        entity.getKeyPrefix(),
                        entity.getName(),
                        entity.getScopes(),
                        entity.getEnvironment(),
                        entity.isActive(),
                        entity.getLastUsedAt(),
                        entity.getExpiresAt(),
                        entity.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public Optional<ApiKey> findByKeyHash(String keyHash) {
        return repository.findByKeyHash(keyHash).map(entity -> ApiKey.reconstitute(
                entity.getId(),
                MerchantId.of(entity.getMerchantId()),
                entity.getKeyHash(),
                entity.getKeyPrefix(),
                entity.getName(),
                entity.getScopes(),
                entity.getEnvironment(),
                entity.isActive(),
                entity.getLastUsedAt(),
                entity.getExpiresAt(),
                entity.getCreatedAt()
        ));
    }
}
