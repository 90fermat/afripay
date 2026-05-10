package com.afripay.domain.model.provider;

public enum ProviderType {
    MTN_MOMO    ("MTN Mobile Money",   new String[]{"CM", "GH", "RW", "UG", "CI"}),
    ORANGE_MONEY("Orange Money",       new String[]{"CM", "CI", "ML", "SN", "BF"}),
    WAVE        ("Wave",               new String[]{"SN", "CI", "ML", "BF"}),
    MPESA       ("M-Pesa",            new String[]{"KE", "TZ", "GH", "MZ"}),
    MOOV        ("Moov Money",         new String[]{"BJ", "TG", "CI", "ML"}),
    SANDBOX     ("AfriDevPay Sandbox", new String[]{"*"});

    private final String displayName;
    private final String[] supportedCountries;

    ProviderType(String displayName, String[] supportedCountries) {
        this.displayName = displayName;
        this.supportedCountries = supportedCountries;
    }

    public String getDisplayName() { return displayName; }

    public boolean supportsCountry(String countryCode) {
        if (supportedCountries.length == 1 && supportedCountries[0].equals("*")) return true;
        for (String c : supportedCountries) { if (c.equalsIgnoreCase(countryCode)) return true; }
        return false;
    }

    public boolean isSandbox() { return this == SANDBOX; }
}
