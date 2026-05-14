package com.afripay.application.port.out.persistence;

import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;

import java.util.Optional;

public interface MerchantPort {
    void save(Merchant merchant);
    Optional<Merchant> findById(MerchantId id);
    Optional<Merchant> findByEmail(String email);
}
