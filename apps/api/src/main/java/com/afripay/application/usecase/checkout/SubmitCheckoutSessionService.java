package com.afripay.application.usecase.checkout;

import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionType;
import com.afripay.domain.port.in.checkout.SubmitCheckoutSessionUseCase;
import com.afripay.domain.port.in.payment.InitiatePaymentUseCase;
import com.afripay.domain.port.out.persistence.CheckoutSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class SubmitCheckoutSessionService implements SubmitCheckoutSessionUseCase {

    private final CheckoutSessionRepository sessionRepository;
    private final InitiatePaymentUseCase initiatePaymentUseCase;

    public SubmitCheckoutSessionService(CheckoutSessionRepository sessionRepository, InitiatePaymentUseCase initiatePaymentUseCase) {
        this.sessionRepository = sessionRepository;
        this.initiatePaymentUseCase = initiatePaymentUseCase;
    }

    @Override
    @Transactional
    public CheckoutSession submit(Command command) {
        CheckoutSession session = sessionRepository.findById(command.sessionId())
                .orElseThrow(() -> new IllegalArgumentException("Checkout Session not found: " + command.sessionId()));

        if (session.isExpired()) {
            session.cancel();
            sessionRepository.save(session);
            throw new IllegalStateException("Checkout Session has expired");
        }

        // Delegate to core payment engine
        Transaction transaction = initiatePaymentUseCase.initiate(new InitiatePaymentUseCase.Command(
                session.getMerchantId().getValue().toString(),
                "chk_" + session.getId().toString(),
                null,
                command.provider(),
                TransactionType.PAYMENT,
                session.getAmount().amountMinorUnits(),
                session.getAmount().currency().getCurrencyCode(),
                command.phoneNumber(),
                null,
                Map.of("checkout_session_id", session.getId().toString())
        ));

        // Mark session as completed with the transaction ID
        session.markCompleted(transaction.getId());
        return sessionRepository.save(session);
    }
}
