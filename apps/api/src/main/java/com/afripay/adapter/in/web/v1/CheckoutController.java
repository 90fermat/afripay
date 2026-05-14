package com.afripay.adapter.in.web.v1;

import com.afripay.domain.model.checkout.CheckoutSession;
import com.afripay.domain.model.provider.ProviderType;
import com.afripay.domain.port.in.checkout.CreateCheckoutSessionUseCase;
import com.afripay.domain.port.in.checkout.GetCheckoutSessionUseCase;
import com.afripay.domain.port.in.checkout.SubmitCheckoutSessionUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/checkout")
@Tag(name = "Checkout", description = "Hosted Checkout Session API for generating payment links")
@SecurityRequirement(name = "apiKeyAuth")
public class CheckoutController {

    private final CreateCheckoutSessionUseCase createUseCase;
    private final GetCheckoutSessionUseCase getUseCase;
    private final SubmitCheckoutSessionUseCase submitUseCase;

    public CheckoutController(CreateCheckoutSessionUseCase createUseCase,
                              GetCheckoutSessionUseCase getUseCase,
                              SubmitCheckoutSessionUseCase submitUseCase) {
        this.createUseCase = createUseCase;
        this.getUseCase = getUseCase;
        this.submitUseCase = submitUseCase;
    }

    @PostMapping("/session")
    @Operation(summary = "Create a checkout session", description = "Creates a new hosted checkout session. Returns a session ID that can be used to redirect customers to the AfriPay checkout page.")
    public ResponseEntity<CheckoutSessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        CheckoutSession session = createUseCase.create(new CreateCheckoutSessionUseCase.Command(
                request.merchantId(),
                request.amountMinorUnits(),
                request.currencyCode(),
                request.returnUrl()
        ));
        return ResponseEntity.ok(mapToResponse(session));
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Get checkout session details", description = "Retrieves the current state of a checkout session including status and linked transaction.")
    public ResponseEntity<CheckoutSessionResponse> getSession(@PathVariable UUID sessionId) {
        CheckoutSession session = getUseCase.getSession(sessionId);
        return ResponseEntity.ok(mapToResponse(session));
    }

    @PostMapping("/session/{sessionId}/submit")
    @Operation(summary = "Submit a checkout payment", description = "Submits the customer's payment details (provider and phone number) to initiate the actual payment for this session.")
    public ResponseEntity<CheckoutSessionResponse> submitSession(
            @PathVariable UUID sessionId,
            @RequestBody SubmitSessionRequest request) {
        
        CheckoutSession session = submitUseCase.submit(new SubmitCheckoutSessionUseCase.Command(
                sessionId,
                ProviderType.valueOf(request.provider().toUpperCase()),
                request.phoneNumber()
        ));
        
        return ResponseEntity.ok(mapToResponse(session));
    }

    private CheckoutSessionResponse mapToResponse(CheckoutSession session) {
        return new CheckoutSessionResponse(
                session.getId(),
                session.getMerchantId().getValue(),
                session.getAmount().amountMinorUnits(),
                session.getAmount().currency().getCurrencyCode(),
                session.getReturnUrl(),
                session.getStatus().name(),
                session.getTransactionId() != null ? session.getTransactionId().getValue() : null,
                session.getExpiresAt().toString()
        );
    }

    public record CreateSessionRequest(
            String merchantId,
            long amountMinorUnits,
            String currencyCode,
            String returnUrl
    ) {}

    public record SubmitSessionRequest(
            String provider,
            String phoneNumber
    ) {}

    public record CheckoutSessionResponse(
            UUID id,
            UUID merchantId,
            long amountMinorUnits,
            String currencyCode,
            String returnUrl,
            String status,
            UUID transactionId,
            String expiresAt
    ) {}
}
