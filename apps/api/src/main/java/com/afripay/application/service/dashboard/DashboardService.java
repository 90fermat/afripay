package com.afripay.application.service.dashboard;

import com.afripay.application.port.out.persistence.ApiKeyPort;
import com.afripay.application.port.out.persistence.MerchantPort;
import com.afripay.application.port.out.persistence.TransactionPort;
import com.afripay.domain.model.apikey.ApiKey;
import com.afripay.domain.model.apikey.ApiKeyEnvironment;
import com.afripay.domain.model.apikey.ApiKeyScope;
import com.afripay.domain.model.common.PaginatedResult;
import com.afripay.domain.model.merchant.Merchant;
import com.afripay.domain.model.merchant.MerchantId;
import com.afripay.domain.model.transaction.Transaction;
import com.afripay.domain.model.webhook.WebhookDelivery;
import com.afripay.domain.port.out.persistence.WebhookDeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class DashboardService {

    private final TransactionPort transactionPort;
    private final ApiKeyPort apiKeyPort;
    private final MerchantPort merchantPort;
    private final WebhookDeliveryRepository webhookDeliveryRepository;

    public DashboardService(TransactionPort transactionPort, ApiKeyPort apiKeyPort,
                            MerchantPort merchantPort, WebhookDeliveryRepository webhookDeliveryRepository) {
        this.transactionPort = transactionPort;
        this.apiKeyPort = apiKeyPort;
        this.merchantPort = merchantPort;
        this.webhookDeliveryRepository = webhookDeliveryRepository;
    }

    public PaginatedResult<Transaction> getTransactions(MerchantId merchantId, int page, int size) {
        return transactionPort.findAllByMerchantId(merchantId, page, size);
    }

    public List<ApiKey> getApiKeys(MerchantId merchantId) {
        return apiKeyPort.findByMerchantIdAndActiveTrue(merchantId);
    }

    public String rollApiKey(MerchantId merchantId, ApiKeyEnvironment environment) {
        // 1. Invalidate existing keys for this environment
        List<ApiKey> existingKeys = apiKeyPort.findByMerchantIdAndActiveTrue(merchantId);
        for (ApiKey key : existingKeys) {
            if (key.getEnvironment() == environment) {
                key.revoke();
                apiKeyPort.save(key);
            }
        }

        // 2. Generate a new key
        ApiKey newKey = ApiKey.create(
                merchantId, 
                environment.name() + " Key", 
                Set.of(ApiKeyScope.PAYMENTS_WRITE, ApiKeyScope.PAYMENTS_READ), 
                environment, 
                null
        );
        apiKeyPort.save(newKey);
        
        return newKey.getRawKeyOnCreation().orElseThrow();
    }

    public Merchant getMerchant(MerchantId merchantId) {
        return merchantPort.findById(merchantId).orElseThrow(() -> new IllegalArgumentException("Merchant not found"));
    }

    public void updateWebhookConfig(MerchantId merchantId, String webhookUrl, String webhookSecret) {
        Merchant merchant = getMerchant(merchantId);
        merchant.updateWebhookConfig(webhookUrl, webhookSecret);
        merchantPort.save(merchant);
    }

    public PaginatedResult<WebhookDelivery> getWebhookLogs(MerchantId merchantId, int page, int size) {
        return webhookDeliveryRepository.findAllByMerchantId(merchantId, page, size);
    }
}
