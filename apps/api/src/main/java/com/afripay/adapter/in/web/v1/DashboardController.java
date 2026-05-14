package com.afripay.adapter.in.web.v1;

import com.afripay.application.service.dashboard.DashboardService;
import com.afripay.domain.model.apikey.ApiKey;
import com.afripay.domain.model.apikey.ApiKeyEnvironment;
import com.afripay.domain.model.common.PaginatedResult;
import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.webhook.WebhookDelivery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard", description = "Merchant Dashboard API for managing transactions, API keys, and webhooks")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    private MerchantId getMerchantId(Authentication authentication) {
        return MerchantId.of(UUID.fromString(authentication.getName()));
    }

    @GetMapping("/transactions")
    @Operation(summary = "List transactions", description = "Returns a paginated list of the merchant's transactions.")
    public ResponseEntity<PaginatedResult<Transaction>> getTransactions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        MerchantId merchantId = getMerchantId(authentication);
        PaginatedResult<Transaction> result = dashboardService.getTransactions(merchantId, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api-keys")
    @Operation(summary = "List API keys", description = "Returns all active API keys for the merchant.")
    public ResponseEntity<List<ApiKey>> getApiKeys(Authentication authentication) {
        MerchantId merchantId = getMerchantId(authentication);
        List<ApiKey> keys = dashboardService.getApiKeys(merchantId);
        return ResponseEntity.ok(keys);
    }

    @PostMapping("/api-keys/roll")
    @Operation(summary = "Roll API key", description = "Invalidates existing keys for the given environment and generates a new one.")
    public ResponseEntity<Map<String, String>> rollApiKey(
            Authentication authentication,
            @RequestBody RollApiKeyRequest request) {
        MerchantId merchantId = getMerchantId(authentication);
        ApiKeyEnvironment env = ApiKeyEnvironment.valueOf(request.environment().toUpperCase());
        String newKey = dashboardService.rollApiKey(merchantId, env);
        return ResponseEntity.ok(Map.of("rawKey", newKey));
    }

    @GetMapping("/webhook")
    @Operation(summary = "Get webhook config", description = "Returns the merchant's webhook URL and secret.")
    public ResponseEntity<Map<String, String>> getWebhookConfig(Authentication authentication) {
        MerchantId merchantId = getMerchantId(authentication);
        Merchant merchant = dashboardService.getMerchant(merchantId);
        return ResponseEntity.ok(Map.of(
                "webhookUrl", merchant.getWebhookUrl() == null ? "" : merchant.getWebhookUrl(),
                "webhookSecret", merchant.getWebhookSecret() == null ? "" : merchant.getWebhookSecret()
        ));
    }

    @PutMapping("/webhook")
    @Operation(summary = "Update webhook config", description = "Updates the merchant's webhook URL and signing secret.")
    public ResponseEntity<Void> updateWebhookConfig(
            Authentication authentication,
            @RequestBody WebhookConfigRequest request) {
        MerchantId merchantId = getMerchantId(authentication);
        dashboardService.updateWebhookConfig(merchantId, request.webhookUrl(), request.webhookSecret());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/webhook/logs")
    @Operation(summary = "List webhook delivery logs", description = "Returns a paginated list of webhook delivery attempts with status, payload, and retry information.")
    public ResponseEntity<PaginatedResult<WebhookLogResponse>> getWebhookLogs(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        MerchantId merchantId = getMerchantId(authentication);
        PaginatedResult<WebhookDelivery> result = dashboardService.getWebhookLogs(merchantId, page, size);

        PaginatedResult<WebhookLogResponse> mapped = new PaginatedResult<>(
                result.content().stream().map(d -> new WebhookLogResponse(
                        d.getId(),
                        d.getEventId(),
                        d.getPayload(),
                        d.getStatus().name(),
                        d.getAttempts(),
                        d.getLastHttpStatus(),
                        d.getNextRetryAt() != null ? d.getNextRetryAt().toString() : null,
                        d.getCreatedAt().toString(),
                        d.getUpdatedAt().toString()
                )).toList(),
                result.page(),
                result.size(),
                result.totalElements(),
                result.totalPages()
        );
        return ResponseEntity.ok(mapped);
    }

    record RollApiKeyRequest(String environment) {}
    record WebhookConfigRequest(String webhookUrl, String webhookSecret) {}
    record WebhookLogResponse(
            UUID id,
            String eventId,
            String payload,
            String status,
            int attempts,
            Integer lastHttpStatus,
            String nextRetryAt,
            String createdAt,
            String updatedAt
    ) {}
}
