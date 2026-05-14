package com.afripay.domain.port.out.persistence;

import com.afripay.domain.model.apikey.ApiKey;
import com.afripay.domain.model.merchant.MerchantId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository {
    ApiKey save(ApiKey apiKey);
    Optional<ApiKey> findById(UUID id);
    Optional<ApiKey> findByKeyHash(String keyHash);
    List<ApiKey> findByMerchantId(MerchantId merchantId);
    void deleteById(UUID id);
}
