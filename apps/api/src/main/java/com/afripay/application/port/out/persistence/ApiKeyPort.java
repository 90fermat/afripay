package com.afripay.application.port.out.persistence;

import com.afripay.domain.model.apikey.ApiKey;
import com.afripay.domain.model.merchant.MerchantId;

import java.util.List;

public interface ApiKeyPort {
    List<ApiKey> findByMerchantIdAndActiveTrue(MerchantId merchantId);
    java.util.Optional<ApiKey> findByKeyHash(String keyHash);
    void save(ApiKey apiKey);
}
