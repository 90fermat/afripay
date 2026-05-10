# AfriDevPay 🌍

> **The unified payment API for Africa.**  
> Integrate MTN MoMo, Orange Money, Wave, M-Pesa and more through a single, developer-first REST API.

[![CI/CD](https://github.com/90fermat/afripay/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/90fermat/afripay/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green)](https://spring.io/projects/spring-boot)

---

## Why AfriDevPay?

Integrating mobile payments in Africa is painful. Every provider has a different API,
different auth flow, different webhook format. AfriDevPay solves this with a single,
clean, well-documented API — inspired by Stripe, built for Africa.

```javascript
// One line to initiate a payment with any provider
const payment = await afripay.payments.create({
  provider: "MTN_MOMO",
  amount: 5000,
  currency: "XAF",
  phone: "+237612345678",
  ref: "ORDER-001"
});
```

---

## Architecture

Hexagonal architecture (Ports & Adapters) with a Java 21 / Spring Boot 3 backend.

```
apps/
├── api/      Java 21 + Spring Boot 3.2  (REST API Gateway)
├── web/      Next.js 14                 (Developer Dashboard)
├── mobile/   React Native + Expo        (Merchant App)
└── docs/     Docusaurus                 (Documentation Portal)
packages/
├── sdk-js/   TypeScript SDK (npm)
└── sdk-java/ Java SDK (Maven)
```

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 21 (for local API development)
- Node.js 20+ (for dashboard/SDK)

### Run locally

```bash
git clone https://github.com/90fermat/afripay.git
cd afripay

# Start the full stack (DB, Redis, API, Dashboard)
docker compose up -d

# API available at:    http://localhost:8080
# Dashboard at:        http://localhost:3000
# Swagger UI at:       http://localhost:8080/swagger-ui
# Adminer (DB UI) at:  http://localhost:8090
```

### API Development

```bash
cd apps/api

# Run tests
./mvnw test

# Run integration tests (requires Docker)
./mvnw verify -Pintegration-tests

# Build
./mvnw package -DskipTests
```

---

## Supported Providers

| Provider      | Countries                    | Status     |
|---------------|------------------------------|------------|
| MTN MoMo      | CM, GH, RW, UG, CI          | ✅ Sandbox |
| Orange Money  | CM, CI, ML, SN, BF          | ✅ Sandbox |
| Wave          | SN, CI, ML, BF               | 🔜 Soon    |
| M-Pesa        | KE, TZ, GH, MZ               | 🔜 Soon    |
| Sandbox       | All                          | ✅ Active  |

---

## API Reference

Full documentation at [docs.afripay.dev](https://docs.afripay.dev).

### Authentication

```
Authorization: Bearer apk_live_your_key_here
```

### Initiate Payment

```http
POST /api/v1/payments
Content-Type: application/json
Authorization: Bearer apk_live_...
Idempotency-Key: <unique-uuid>

{
  "provider": "MTN_MOMO",
  "type": "PAYMENT",
  "amount": 500000,
  "currency": "XAF",
  "phone_number": "+237612345678",
  "external_ref": "ORDER-20240101-001",
  "customer_ref": "John Doe"
}
```

---

## Tech Stack

| Layer          | Technology           |
|----------------|---------------------|
| API            | Java 21, Spring Boot 3.2 |
| Database       | PostgreSQL 16        |
| Cache          | Redis 7              |
| Migrations     | Flyway               |
| Resilience     | Resilience4j         |
| Dashboard      | Next.js 14           |
| Mobile         | React Native + Expo  |
| Container      | Docker               |
| CI/CD          | GitHub Actions       |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All contributions welcome.

## License

MIT — see [LICENSE](LICENSE).
