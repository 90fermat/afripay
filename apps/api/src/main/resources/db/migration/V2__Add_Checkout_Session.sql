CREATE TABLE checkout_sessions (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    amount_minor_units BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    return_url VARCHAR(2048) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_checkout_sessions_merchant_id ON checkout_sessions(merchant_id);
