package com.afripay.application.usecase.checkout;

import com.afripay.domain.exception.DomainExceptions.MerchantNotFoundException;
import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Money;
import com.afripay.domain.port.in.checkout.CreateCheckoutSessionUseCase;
import com.afripay.domain.port.out.persistence.CheckoutSessionRepository;
import com.afripay.domain.port.out.persistence.MerchantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCheckoutSessionService implements CreateCheckoutSessionUseCase {

    private final CheckoutSessionRepository sessionRepository;
    private final MerchantRepository merchantRepository;

    public CreateCheckoutSessionService(CheckoutSessionRepository sessionRepository, MerchantRepository merchantRepository) {
        this.sessionRepository = sessionRepository;
        this.merchantRepository = merchantRepository;
    }

    @Override
    @Transactional
    public CheckoutSession create(Command command) {
        MerchantId merchantId = MerchantId.of(command.merchantId());
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new MerchantNotFoundException(merchantId));

        merchant.assertActive();

        Money amount = Money.of(command.amountMinorUnits(), command.currencyCode());
        CheckoutSession session = CheckoutSession.create(merchantId, amount, command.returnUrl());

        return sessionRepository.save(session);
    }
}
