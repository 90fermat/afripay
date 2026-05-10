-- ============================================================
-- V1__init_schema.sql
-- AfriDevPay — Initial database schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- MERCHANTS
-- ============================================================
CREATE TABLE merchants (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    business_name   VARCHAR(255),
    email           VARCHAR(255)    NOT NULL,
    phone_number    VARCHAR(50),
    country_code    CHAR(2)         NOT NULL,
    status          VARCHAR(50)     NOT NULL DEFAULT 'PENDING',
    tier            VARCHAR(50)     NOT NULL DEFAULT 'STARTER',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT merchants_email_unique   UNIQUE (email),
    CONSTRAINT merchants_status_check   CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
    CONSTRAINT merchants_tier_check     CHECK (tier IN ('STARTER', 'GROWTH', 'ENTERPRISE')),
    CONSTRAINT merchants_country_check  CHECK (country_code ~ '^[A-Z]{2}$')
);

CREATE INDEX idx_merchants_email       ON merchants (email);
CREATE INDEX idx_merchants_status      ON merchants (status);
CREATE INDEX idx_merchants_created_at  ON merchants (created_at DESC);

-- ============================================================
-- API KEYS
-- ============================================================
CREATE TABLE api_keys (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID            NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    key_hash        VARCHAR(64)     NOT NULL,
    key_prefix      VARCHAR(30)     NOT NULL,
    name            VARCHAR(255),
    scopes          TEXT[]          NOT NULL DEFAULT '{}',
    environment     VARCHAR(10)     NOT NULL DEFAULT 'TEST',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    last_used_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT api_keys_hash_unique        UNIQUE (key_hash),
    CONSTRAINT api_keys_environment_check  CHECK (environment IN ('LIVE', 'TEST'))
);

CREATE INDEX idx_api_keys_merchant_id  ON api_keys (merchant_id);
CREATE INDEX idx_api_keys_key_hash     ON api_keys (key_hash);
CREATE INDEX idx_api_keys_active       ON api_keys (merchant_id) WHERE is_active = TRUE;

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE transactions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID            NOT NULL REFERENCES merchants(id),
    external_ref        VARCHAR(255)    NOT NULL,
    idempotency_key     VARCHAR(255),
    provider            VARCHAR(50)     NOT NULL,
    provider_tx_id      VARCHAR(255),
    type                VARCHAR(50)     NOT NULL,
    status              VARCHAR(50)     NOT NULL DEFAULT 'PENDING',
    amount              BIGINT          NOT NULL,
    currency            CHAR(3)         NOT NULL,
    phone_number        VARCHAR(50)     NOT NULL,
    customer_ref        VARCHAR(255),
    metadata            JSONB           NOT NULL DEFAULT '{}',
    failure_reason      TEXT,
    provider_response   JSONB,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT transactions_external_ref_merchant_unique  UNIQUE (external_ref, merchant_id),
    CONSTRAINT transactions_idempotency_key_unique         UNIQUE (idempotency_key),
    CONSTRAINT transactions_amount_positive                CHECK (amount > 0),
    CONSTRAINT transactions_status_check   CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED', 'CANCELLED')),
    CONSTRAINT transactions_type_check     CHECK (type IN ('PAYMENT', 'REFUND', 'PAYOUT')),
    CONSTRAINT transactions_provider_check CHECK (provider IN ('MTN_MOMO', 'ORANGE_MONEY', 'WAVE', 'MPESA', 'MOOV', 'SANDBOX'))
);

CREATE INDEX idx_transactions_merchant_id        ON transactions (merchant_id);
CREATE INDEX idx_transactions_merchant_status    ON transactions (merchant_id, status);
CREATE INDEX idx_transactions_provider_tx_id     ON transactions (provider_tx_id) WHERE provider_tx_id IS NOT NULL;
CREATE INDEX idx_transactions_idempotency_key    ON transactions (idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_transactions_created_at         ON transactions (created_at DESC);
CREATE INDEX idx_transactions_external_ref       ON transactions (external_ref, merchant_id);

-- ============================================================
-- WEBHOOKS
-- ============================================================
CREATE TABLE webhooks (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID            NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    url             TEXT            NOT NULL,
    secret          VARCHAR(255)    NOT NULL,
    events          TEXT[]          NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_merchant_id  ON webhooks (merchant_id);
CREATE INDEX idx_webhooks_active       ON webhooks (merchant_id) WHERE is_active = TRUE;

-- ============================================================
-- WEBHOOK DELIVERIES
-- ============================================================
CREATE TABLE webhook_deliveries (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id      UUID            NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    transaction_id  UUID            REFERENCES transactions(id),
    event_type      VARCHAR(100)    NOT NULL,
    payload         JSONB           NOT NULL,
    status          VARCHAR(50)     NOT NULL DEFAULT 'PENDING',
    attempt_count   INT             NOT NULL DEFAULT 0,
    response_code   INT,
    response_body   TEXT,
    next_retry_at   TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT webhook_deliveries_status_check CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'ABANDONED'))
);

CREATE INDEX idx_webhook_deliveries_webhook_id  ON webhook_deliveries (webhook_id);
CREATE INDEX idx_webhook_deliveries_status      ON webhook_deliveries (status);
CREATE INDEX idx_webhook_deliveries_next_retry  ON webhook_deliveries (next_retry_at) WHERE status = 'PENDING';

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID,
    actor           VARCHAR(255),
    action          VARCHAR(255)    NOT NULL,
    resource_type   VARCHAR(100),
    resource_id     UUID,
    metadata        JSONB,
    ip_address      INET,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_merchant_id  ON audit_logs (merchant_id);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_action       ON audit_logs (action);

-- ============================================================
-- AUTOMATIC updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
