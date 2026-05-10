# AfriDevPay — Architecture Technique (Production-Ready)

## 1. Vue d'ensemble

AfriDevPay est une **plateforme d'orchestration de paiements africains** exposant une API unifiée
pour développeurs. Elle agrège les providers Mobile Money (MTN MoMo, Orange Money, Wave, M-Pesa…)
derrière une interface unique, propre et documentée — à la façon de Stripe.

---

## 2. Structure du Monorepo (Turborepo)

```
afripay/
├── apps/
│   ├── api/                        # Spring Boot 3.x — API Gateway (Java 21)
│   ├── web/                        # Next.js 14 App Router — Dashboard développeur
│   ├── mobile/                     # React Native (Expo) — App marchands
│   └── docs/                       # Docusaurus — Portail de documentation
├── packages/
│   ├── sdk-js/                     # SDK TypeScript/JavaScript (npm)
│   ├── sdk-java/                   # SDK Java (Maven Central)
│   └── shared-types/               # Types TypeScript partagés
├── infrastructure/
│   ├── docker/                     # Dockerfiles + docker-compose
│   ├── k8s/                        # Manifests Kubernetes
│   └── terraform/                  # IaC (cloud provider agnostic)
├── scripts/                        # Scripts CI/CD, seeds, migrations
├── .github/
│   └── workflows/                  # GitHub Actions pipelines
├── turbo.json
├── package.json
└── README.md
```

---

## 3. Architecture Backend — Hexagonale (Ports & Adapters)

L'API est construite selon l'**architecture hexagonale** pour maximiser la testabilité,
la maintenabilité et l'indépendance vis-à-vis des frameworks.

```
apps/api/src/main/java/com/afripay/
├── AfriPayApplication.java
│
├── domain/                          # ★ Cœur métier — 0 dépendance framework
│   ├── model/
│   │   ├── merchant/
│   │   │   ├── Merchant.java
│   │   │   ├── MerchantId.java
│   │   │   ├── MerchantStatus.java
│   │   │   └── MerchantTier.java
│   │   ├── transaction/
│   │   │   ├── Transaction.java
│   │   │   ├── TransactionId.java
│   │   │   ├── TransactionStatus.java
│   │   │   ├── Money.java
│   │   │   └── TransactionType.java
│   │   ├── apikey/
│   │   │   ├── ApiKey.java
│   │   │   ├── ApiKeyScope.java
│   │   │   └── ApiKeyEnvironment.java
│   │   └── provider/
│   │       └── ProviderType.java
│   │
│   ├── port/
│   │   ├── in/payment/
│   │   │   ├── InitiatePaymentUseCase.java
│   │   │   ├── VerifyPaymentUseCase.java
│   │   │   └── RefundPaymentUseCase.java
│   │   └── out/
│   │       ├── persistence/
│   │       │   ├── MerchantRepository.java
│   │       │   ├── TransactionRepository.java
│   │       │   └── ApiKeyRepository.java
│   │       └── provider/
│   │           └── PaymentProviderPort.java
│   │
│   └── exception/
│       ├── DomainExceptions.java
│       ├── InvalidTransactionStateException.java
│       └── MerchantNotActiveException.java
│
├── application/
│   └── usecase/payment/
│       ├── InitiatePaymentService.java
│       ├── VerifyPaymentService.java
│       ├── RefundPaymentService.java
│       ├── PaymentProviderRegistry.java
│       └── WebhookDispatcherPort.java
│
├── adapter/
│   ├── in/web/v1/                   # REST Controllers (à venir)
│   └── out/
│       ├── persistence/             # JPA Adapters (à venir)
│       ├── provider/                # Mobile Money adapters (à venir)
│       └── notification/            # Webhook dispatcher (à venir)
│
└── config/                          # Spring configuration (à venir)
```

---

## 4. Schéma de Base de Données (PostgreSQL)

```sql
merchants       — Comptes marchands/développeurs
api_keys        — Clés API (hash SHA-256, scopes, environnement)
transactions    — Toutes les transactions (PAYMENT, REFUND, PAYOUT)
webhooks        — Endpoints configurés par les marchands
webhook_deliveries — Tentatives de livraison avec retry
audit_logs      — Traçabilité complète de toutes les actions
```

---

## 5. API Design

### Versioning : `/api/v1/`

### Auth : `Authorization: Bearer apk_live_xxx`

### Idempotence : header `Idempotency-Key: <uuid>`

### Format unifié
```json
{ "success": true, "data": {}, "meta": { "timestamp": "", "request_id": "" } }
{ "success": false, "error": { "code": "XXX", "message": "..." }, "meta": {} }
```

---

## 6. Sécurité
- API Keys stockées hashées SHA-256 (jamais en clair)
- Webhooks signés HMAC-SHA256
- Rate limiting par sliding window (Redis)
- Idempotence Redis (TTL 24h)
- Scope-based access control
- Audit logs complets

---

## 7. Résilience (Resilience4j)
- Circuit Breaker par provider (CLOSED → OPEN → HALF_OPEN)
- Retry exponentiel : 1s → 2s → 4s (max 3 tentatives)
- Webhook retry : immédiat → +5min → +30min → +2h → +12h

---

## 8. Stack

| Couche | Technologie |
|--------|------------|
| API | Java 21 + Spring Boot 3.2 |
| ORM | Spring Data JPA + Hibernate |
| Migrations | Flyway |
| Cache | Redis 7 |
| HTTP Client | WebFlux WebClient |
| Résilience | Resilience4j |
| Sécurité | Spring Security |
| Docs API | SpringDoc OpenAPI 3 |
| Tests | JUnit 5 + Mockito + Testcontainers |
| Frontend | Next.js 14 |
| Mobile | React Native + Expo |
| Base de données | PostgreSQL 16 |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

*Document vivant — mis à jour à chaque évolution architecturale majeure.*
