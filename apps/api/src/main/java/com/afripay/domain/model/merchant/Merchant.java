package com.afripay.domain.model.merchant;

import com.afripay.domain.exception.MerchantNotActiveException;

import java.time.Instant;
import java.util.Objects;

public class Merchant {

    private final MerchantId id;
    private final String email;
    private final String countryCode;

    private String name;
    private String businessName;
    private String phoneNumber;
    private MerchantStatus status;
    private MerchantTier tier;

    private String webhookUrl;
    private String webhookSecret;

    private final Instant createdAt;
    private Instant updatedAt;

    private Merchant(MerchantId id, String name, String email, String countryCode, Instant createdAt) {
        this.id          = Objects.requireNonNull(id);
        this.name        = validateName(name);
        this.email       = validateEmail(email);
        this.countryCode = validateCountryCode(countryCode);
        this.status      = MerchantStatus.PENDING;
        this.tier        = MerchantTier.STARTER;
        this.createdAt   = Objects.requireNonNull(createdAt);
        this.updatedAt   = createdAt;
    }

    public static Merchant register(String name, String email, String countryCode) {
        return new Merchant(MerchantId.generate(), name, email, countryCode, Instant.now());
    }

    public static Merchant reconstitute(MerchantId id, String name, String businessName, String email,
                                        String phoneNumber, String countryCode, MerchantStatus status,
                                        MerchantTier tier, String webhookUrl, String webhookSecret,
                                        Instant createdAt, Instant updatedAt) {
        Merchant m = new Merchant(id, name, email, countryCode, createdAt);
        m.businessName = businessName;
        m.phoneNumber  = phoneNumber;
        m.status       = Objects.requireNonNull(status);
        m.tier         = Objects.requireNonNull(tier);
        m.webhookUrl   = webhookUrl;
        m.webhookSecret= webhookSecret;
        m.updatedAt    = updatedAt;
        return m;
    }

    public void updateWebhookConfig(String webhookUrl, String webhookSecret) {
        // basic URL validation if needed
        this.webhookUrl = webhookUrl;
        this.webhookSecret = webhookSecret;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        if (status == MerchantStatus.SUSPENDED)
            throw new IllegalStateException("A suspended merchant must be reinstated before activation: " + id);
        this.status = MerchantStatus.ACTIVE;
        this.updatedAt = Instant.now();
    }

    public void suspend(String reason) {
        Objects.requireNonNull(reason, "Suspension reason must not be null");
        this.status = MerchantStatus.SUSPENDED;
        this.updatedAt = Instant.now();
    }

    public void upgradeTier(MerchantTier newTier) {
        if (newTier.ordinal() <= this.tier.ordinal())
            throw new IllegalArgumentException("New tier %s is not higher than current tier %s".formatted(newTier, this.tier));
        this.tier = newTier;
        this.updatedAt = Instant.now();
    }

    public void updateProfile(String name, String businessName, String phoneNumber) {
        this.name = validateName(name);
        this.businessName = businessName;
        this.phoneNumber = phoneNumber;
        this.updatedAt = Instant.now();
    }

    public void assertActive() {
        if (status != MerchantStatus.ACTIVE)
            throw new MerchantNotActiveException(id, status);
    }

    private String validateName(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Merchant name must not be blank");
        if (name.length() > 255) throw new IllegalArgumentException("Merchant name exceeds 255 characters");
        return name.strip();
    }

    private String validateEmail(String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email must not be blank");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw new IllegalArgumentException("Invalid email format: " + email);
        return email.toLowerCase().strip();
    }

    private String validateCountryCode(String code) {
        if (code == null || code.length() != 2) throw new IllegalArgumentException("Country code must be ISO 3166-1 alpha-2: " + code);
        return code.toUpperCase();
    }

    public MerchantId getId()        { return id; }
    public String getName()          { return name; }
    public String getBusinessName()  { return businessName; }
    public String getEmail()         { return email; }
    public String getPhoneNumber()   { return phoneNumber; }
    public String getCountryCode()   { return countryCode; }
    public MerchantStatus getStatus(){ return status; }
    public MerchantTier getTier()    { return tier; }
    public String getWebhookUrl()    { return webhookUrl; }
    public String getWebhookSecret() { return webhookSecret; }
    public Instant getCreatedAt()    { return createdAt; }
    public Instant getUpdatedAt()    { return updatedAt; }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Merchant that)) return false; return id.equals(that.id); }
    @Override public int hashCode() { return Objects.hash(id); }
    @Override public String toString() { return "Merchant{id=%s, email=%s, status=%s, tier=%s}".formatted(id, email, status, tier); }
}
