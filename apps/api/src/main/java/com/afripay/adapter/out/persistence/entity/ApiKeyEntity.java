package com.afripay.adapter.out.persistence.entity;

import com.afripay.domain.model.apikey.ApiKeyEnvironment;
import com.afripay.domain.model.apikey.ApiKeyScope;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "api_keys")
@Getter
@Setter
public class ApiKeyEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(name = "key_hash", nullable = false, unique = true)
    private String keyHash;

    @Column(name = "key_prefix", nullable = false)
    private String keyPrefix;

    @Column(name = "name")
    private String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scopes", columnDefinition = "jsonb")
    private Set<ApiKeyScope> scopes;

    @Enumerated(EnumType.STRING)
    @Column(name = "environment", nullable = false)
    private ApiKeyEnvironment environment;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
