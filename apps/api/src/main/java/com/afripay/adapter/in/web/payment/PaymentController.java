package com.afripay.adapter.in.web.payment;

import com.afripay.application.port.in.payment.InitiatePaymentCommand;
import com.afripay.application.port.in.payment.InitiatePaymentUseCase;
import com.afripay.application.port.in.payment.RefundPaymentUseCase;
import com.afripay.application.port.in.payment.VerifyPaymentUseCase;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.transaction.TransactionId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments", description = "Unified Payment API for initiating, verifying and refunding payments")
@SecurityRequirement(name = "apiKeyAuth")
public class PaymentController {

    private final InitiatePaymentUseCase initiatePaymentUseCase;
    private final VerifyPaymentUseCase verifyPaymentUseCase;
    private final RefundPaymentUseCase refundPaymentUseCase;

    public PaymentController(InitiatePaymentUseCase initiatePaymentUseCase,
                             VerifyPaymentUseCase verifyPaymentUseCase,
                             RefundPaymentUseCase refundPaymentUseCase) {
        this.initiatePaymentUseCase = initiatePaymentUseCase;
        this.verifyPaymentUseCase = verifyPaymentUseCase;
        this.refundPaymentUseCase = refundPaymentUseCase;
    }

    @PostMapping
    @Operation(summary = "Initiate a payment")
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody PaymentRequest request,
                                                           Authentication authentication) {
        String merchantId = authentication.getName(); // Extracted from ApiKey in filter
        boolean isTestMode = isTestKey(authentication);

        InitiatePaymentCommand command = new InitiatePaymentCommand(
                merchantId,
                request.amount(),
                request.currency(),
                request.provider(),
                request.customerPhone(),
                request.returnUrl(),
                request.metadata(),
                isTestMode
        );

        Transaction transaction = initiatePaymentUseCase.initiatePayment(command);
        return ResponseEntity.ok(PaymentResponse.from(transaction));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Verify a payment status")
    public ResponseEntity<PaymentResponse> verifyPayment(@PathVariable String id, Authentication authentication) {
        Transaction transaction = verifyPaymentUseCase.verifyPayment(authentication.getName(), TransactionId.of(id));
        return ResponseEntity.ok(PaymentResponse.from(transaction));
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund a successful payment")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable String id, 
                                                         @RequestBody Map<String, String> body,
                                                         Authentication authentication) {
        String reason = body.getOrDefault("reason", "Requested by merchant");
        Transaction transaction = refundPaymentUseCase.refundPayment(authentication.getName(), TransactionId.of(id), reason);
        return ResponseEntity.ok(PaymentResponse.from(transaction));
    }

    // A helper method that checks if the credentials started with "sk_test_"
    private boolean isTestKey(Authentication authentication) {
        if (authentication.getCredentials() instanceof String apiKey) {
            return apiKey.startsWith("sk_test_");
        }
        return false;
    }

    public record PaymentRequest(
            @NotNull @DecimalMin("1.0") BigDecimal amount,
            @NotBlank String currency,
            @NotBlank String provider,
            @NotBlank String customerPhone,
            String returnUrl,
            Map<String, Object> metadata
    ) {}

    public record PaymentResponse(
            String id,
            String status,
            String provider,
            String amount,
            String currency,
            String providerTransactionId,
            String failureReason
    ) {
        public static PaymentResponse from(Transaction t) {
            return new PaymentResponse(
                    t.getId().toString(),
                    t.getStatus().name(),
                    t.getProvider().name(),
                    t.getAmount().toMajorUnits().toPlainString(),
                    t.getAmount().getCurrencyCode(),
                    t.getProviderTransactionId(),
                    t.getFailureReason()
            );
        }
    }
}
