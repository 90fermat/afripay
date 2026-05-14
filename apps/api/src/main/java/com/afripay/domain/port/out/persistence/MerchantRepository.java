package com.afripay.domain.port.out.persistence;

import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;

import java.util.Optional;

public interface MerchantRepository {
    Merchant save(Merchant merchant);
    Optional<Merchant> findById(MerchantId id);
    Optional<Merchant> findByEmail(String email);
    boolean existsByEmail(String email);
}
