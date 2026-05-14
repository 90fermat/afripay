# Building AfriPay: A Production-Grade Mobile Money Payment Gateway for Africa

*How I built a Stripe-like payment API for African mobile money — from reactive architecture to webhook retry engines.*

---

![AfriPay Banner](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/placeholder.png)

## The Problem

If you're a developer in Africa building an e-commerce platform, a SaaS product, or a marketplace, accepting payments is your biggest headache.

Credit cards? Only [~3% of Sub-Saharan Africans](https://www.worldbank.org/en/topic/financialinclusion) have them. The real payment rails are **mobile money** — MTN MoMo, Orange Money, Airtel Money, M-Pesa — and they're fragmented across dozens of APIs, each with their own authentication, callback formats, and failure modes.

There is no "Stripe for Africa." So I built one.

**AfriPay** (AfriDevPay) is an open-source, production-grade payment gateway that gives African developers a single, unified API to accept mobile money payments. Three lines of code. Any provider. Any country.

```javascript
const payment = await afripay.payments.create({
  amount: 5000,        // 5,000 XAF
  currency: 'XAF',
  provider: 'MTN_MOMO',
  customerPhone: '237670000000',
});
```

## The Architecture

I chose **Clean Architecture** (Hexagonal / Ports & Adapters) because payment systems demand strict separation of concerns. The domain logic — money calculations, transaction state machines, retry scheduling — must never depend on Spring Boot, PostgreSQL, or any specific mobile money API.

```
┌─────────────────────────────────────────────┐
│                  Adapters                    │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │REST API  │  │PostgreSQL│  │MTN MoMo API│ │
│  │Dashboard │  │Redis     │  │Orange Money│ │
│  │Checkout  │  │Flyway    │  │Sandbox     │ │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘ │
│       │              │              │        │
├───────▼──────────────▼──────────────▼────────┤
│              Application Layer               │
│  InitiatePaymentUseCase                      │
│  VerifyPaymentUseCase                        │
│  CreateCheckoutSessionUseCase                │
│  WebhookEventPublisher                       │
├──────────────────────────────────────────────┤
│              Domain Layer                    │
│  Transaction, Money, Merchant, WebhookDelivery│
│  PaymentProviderPort, WebhookDeliveryRepository│
└──────────────────────────────────────────────┘
```

### The Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Java 21 (records, pattern matching, sealed classes) |
| Framework | Spring Boot 3.2 |
| Database | PostgreSQL + Flyway migrations |
| Caching | Redis |
| Resilience | Resilience4j (circuit breakers) |
| API Docs | SpringDoc OpenAPI (Swagger) |
| Frontend | Next.js 15, React 19, Tailwind CSS |
| CI/CD | GitHub Actions |

## Key Features Deep-Dive

### 1. Reactive Payment Provider Engine

The core innovation is the `PaymentProviderPort` interface. Every mobile money provider — MTN, Orange, Sandbox — implements the same contract:

```java
public interface PaymentProviderPort {
    String providerId();
    Mono<ProviderResponse> initiatePayment(Transaction transaction);
    Mono<ProviderResponse> checkStatus(String providerTransactionId);
    Mono<ProviderResponse> refund(String originalTxId, Transaction transaction);
}
```

This means adding a new provider (e.g., Airtel Money, M-Pesa) is just implementing this interface. No changes to the API layer, no changes to the domain. The `PaymentProviderRegistry` discovers providers at startup and routes payments dynamically.

### 2. Hosted Checkout

Instead of forcing merchants to build their own payment UI, AfriPay provides a hosted checkout page (inspired by Stripe Checkout):

1. Merchant creates a `CheckoutSession` via API
2. Customer is redirected to `/pay/{sessionId}`
3. Customer selects provider, enters phone number
4. AfriPay processes the payment and redirects back

The checkout page uses glassmorphism design with dark mode — it feels premium and trustworthy, which matters for payment conversion rates.

### 3. Webhook Retry Engine

This is where most payment integrations fail in production. What happens when the merchant's server is down? With a fire-and-forget webhook, that payment notification is lost forever.

AfriPay's webhook engine is **database-backed with exponential backoff**:

```java
public void markFailed(int httpStatus) {
    this.attempts++;
    this.lastHttpStatus = httpStatus;
    if (this.attempts >= MAX_ATTEMPTS) {
        this.status = WebhookDeliveryStatus.FAILED;
    } else {
        // Exponential backoff: 2m, 10m, 50m, ~4h
        long delayMinutes = (long)(2 * Math.pow(5, this.attempts - 1));
        this.nextRetryAt = Instant.now().plus(Duration.ofMinutes(delayMinutes));
    }
}
```

Every delivery is persisted in the database. Merchants can inspect delivery attempts, HTTP response codes, and full payloads from their dashboard. Zero lost webhooks.

### 4. The `Money` Record

Money handling is notoriously error-prone. I built a `Money` record that operates exclusively in minor units (cents/francs) to avoid floating-point errors:

```java
public record Money(long amountMinorUnits, Currency currency) {
    public Money {
        if (amountMinorUnits < 0) throw new IllegalArgumentException("Cannot be negative");
        Objects.requireNonNull(currency);
    }

    public Money add(Money other) {
        assertSameCurrency(other);
        return new Money(Math.addExact(this.amountMinorUnits, other.amountMinorUnits()), currency);
    }
}
```

No BigDecimal. No floating point. Just longs and type safety.

## The Merchant Dashboard

Every payment gateway needs a dashboard. AfriPay's is built with Next.js 15 and features:

- **Transaction monitoring** with real-time status
- **API key management** with environment separation (test/live)
- **Webhook configuration** with delivery logs
- **Hosted checkout** session management

The UI uses a dark mode glassmorphism design system with subtle animations — it doesn't look like a side project.

## What I Learned

1. **Payment systems are state machines.** Every transaction moves through `PENDING → SUCCESS/FAILED → REFUNDED`. Model this explicitly.

2. **Idempotency is everything.** Mobile money APIs are unreliable. Your system must handle duplicate callbacks, network timeouts, and partial failures gracefully.

3. **Webhooks need retry logic.** A 99.9% uptime merchant endpoint still has ~8.7 hours of downtime per year. Exponential backoff with persistence is non-negotiable.

4. **Clean Architecture pays off.** When I needed to add the Sandbox provider for testing, I just implemented `PaymentProviderPort`. Zero changes to the API layer. Zero changes to the domain.

## Try It Yourself

AfriPay is fully open source:

🔗 **GitHub**: [github.com/90fermat/afripay](https://github.com/90fermat/afripay)
📖 **Documentation**: [afripay.dev/docs](https://afripay.dev/docs)
🚀 **Live Demo**: [afripay.dev](https://afripay.dev)

### Quick Start

```bash
# Clone the repo
git clone https://github.com/90fermat/afripay.git

# Start the backend
cd apps/api && gradle bootRun

# Start the frontend
cd apps/web && npm install && npm run dev
```

Get your sandbox API keys from the dashboard and make your first payment in under 5 minutes.

## What's Next

- **JavaScript SDK** — Published on npm for seamless Node.js integration
- **More providers** — Airtel Money, M-Pesa, Wave
- **Multi-currency** — XOF, KES, GHS, NGN support
- **React Native merchant app** — Mobile dashboard for on-the-go merchants

---

If you're building something in Africa and struggling with payments, give AfriPay a try. Star the repo, open an issue, or submit a PR. Let's build the payment infrastructure Africa deserves. 🌍

---

*Built with ❤️ by [90fermat](https://github.com/90fermat)*

**Tags**: #java #springboot #nextjs #fintech #opensource #payments #africa
