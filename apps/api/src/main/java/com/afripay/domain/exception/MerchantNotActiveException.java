package com.afripay.domain.exception;

import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.merchant.MerchantStatus;

public class MerchantNotActiveException extends DomainExceptions.MerchantNotActiveException {
    public MerchantNotActiveException(MerchantId id, MerchantStatus status) {
        super(id, status);
    }
}
