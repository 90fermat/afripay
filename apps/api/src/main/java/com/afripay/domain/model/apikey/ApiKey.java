package com.afripay.domain.model.apikey;

import com.afripay.domain.model.merchant.MerchantId;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

public class ApiKey {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String LIVE_PREFIX = "apk_live_";
    private static final String TEST_PREFIX = "apk_test_";

    private final UUID id;
    private final MerchantId merchantId;
    private final String keyHash;
    private final String keyPrefix;
    private final String name;
    private final Set<ApiKeyScope> scopes;
    private final ApiKeyEnvironment environment;

    private boolean active;
    private Instant lastUsedAt;
    private final Instant expiresAt;
    private final Instant createdAt;
    private final String rawKeyOnCreation;

    public static ApiKey create(MerchantId merchantId, String name, Set<ApiKeyScope> scopes,
                                ApiKeyEnvironment environment, Instant expiresAt) {
        String rawKey = generateRawKey(environment);
        String hash   = sha256(rawKey);
        String prefix = rawKey.substring(0, Math.min(rawKey.length(), 20));
        return new ApiKey(UUID.randomUUID(), merchantId, hash, prefix, name, scopes,
            environment, true, null, expiresAt, Instant.now(), rawKey);
    }

    public static ApiKey reconstitute(UUID id, MerchantId merchantId, String keyHash, String keyPrefix,
                                      String name, Set<ApiKeyScope> scopes, ApiKeyEnvironment environment,
                                      boolean active, Instant lastUsedAt, Instant expiresAt, Instant createdAt) {
        return new ApiKey(id, merchantId, keyHash, keyPrefix, name, scopes,
            environment, active, lastUsedAt, expiresAt, createdAt, null);
    }

    private ApiKey(UUID id, MerchantId merchantId, String keyHash, String keyPrefix, String name,
                   Set<ApiKeyScope> scopes, ApiKeyEnvironment environment, boolean active,
                   Instant lastUsedAt, Instant expiresAt, Instant createdAt, String rawKeyOnCreation) {
        this.id               = Objects.requireNonNull(id);
        this.merchantId       = Objects.requireNonNull(merchantId);
        this.keyHash          = Objects.requireNonNull(keyHash);
        this.keyPrefix        = Objects.requireNonNull(keyPrefix);
        this.name             = name;
        this.scopes           = scopes != null && !scopes.isEmpty() ? EnumSet.copyOf(scopes) : EnumSet.noneOf(ApiKeyScope.class);
        this.environment      = Objects.requireNonNull(environment);
        this.active           = active;
        this.lastUsedAt       = lastUsedAt;
        this.expiresAt        = expiresAt;
        this.createdAt        = Objects.requireNonNull(createdAt);
        this.rawKeyOnCreation = rawKeyOnCreation;
    }

    public boolean matches(String candidateRawKey) {
        if (candidateRawKey == null) return false;
        return MessageDigest.isEqual(
            keyHash.getBytes(StandardCharsets.UTF_8),
            sha256(candidateRawKey).getBytes(StandardCharsets.UTF_8));
    }

    public boolean isValid() {
        if (!active) return false;
        if (expiresAt != null && Instant.now().isAfter(expiresAt)) return false;
        return true;
    }

    public boolean hasScope(ApiKeyScope scope) { return scopes.contains(scope); }
    public void revoke() { this.active = false; }
    public void recordUsage() { this.lastUsedAt = Instant.now(); }

    private static String generateRawKey(ApiKeyEnvironment env) {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        String suffix = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String prefix = env == ApiKeyEnvironment.LIVE ? LIVE_PREFIX : TEST_PREFIX;
        return prefix + suffix;
    }

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) { hex.append(String.format("%02x", b)); }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public UUID getId()                      { return id; }
    public MerchantId getMerchantId()        { return merchantId; }
    public String getKeyHash()               { return keyHash; }
    public String getKeyPrefix()             { return keyPrefix; }
    public String getName()                  { return name; }
    public Set<ApiKeyScope> getScopes()      { return Collections.unmodifiableSet(scopes); }
    public ApiKeyEnvironment getEnvironment(){ return environment; }
    public boolean isActive()                { return active; }
    public Instant getLastUsedAt()           { return lastUsedAt; }
    public Instant getExpiresAt()            { return expiresAt; }
    public Instant getCreatedAt()            { return createdAt; }
    public Optional<String> getRawKeyOnCreation() { return Optional.ofNullable(rawKeyOnCreation); }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof ApiKey that)) return false; return id.equals(that.id); }
    @Override public int hashCode() { return Objects.hash(id); }
}
