@echo off
REM ============================================================
REM AfriDevPay — GitHub Push Script
REM Run this script once from D:\workspace\backend\personal\afripay
REM ============================================================

echo [1/4] Initializing git repository...
git init
git branch -M main

echo [2/4] Staging all files...
git add .

echo [3/4] Creating initial commit...
git commit -m "feat: initial production-ready scaffold

- Hexagonal architecture (Ports and Adapters)
- Domain layer: Transaction, Merchant, ApiKey aggregates
- Money value object (minor units, currency-safe arithmetic)
- Full typed exception hierarchy with error codes
- Application services: initiate, verify, refund payments
- Idempotency and duplicate detection
- Flyway V1 migration with optimized indexes and triggers
- Resilience4j circuit breakers per provider
- Java 21 Virtual Threads enabled
- Multi-stage Docker build (non-root user, ZGC)
- GitHub Actions CI/CD pipeline (6 stages)
- docker-compose local stack (PostgreSQL + Redis + MailHog)"

echo [4/4] Pushing to GitHub...
git remote add origin https://github.com/90fermat/afripay.git
git push -u origin main

echo.
echo Done! Visit: https://github.com/90fermat/afripay
pause
