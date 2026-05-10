# AfriDevPay — Global Configuration & Development Standards

This document establishes the rigorous, production-grade standards for the `afripay` project. As an AI assistant or human developer, you MUST adhere to these rules implicitly. **Do not deviate from these standards unless explicitly requested by the user.**

## 1. Architectural Integrity
- **Hexagonal Architecture:** The project uses Ports and Adapters. 
    - The `domain` package MUST remain completely free of any framework dependencies (no Spring, no JPA, no Jackson annotations). It contains pure Java 21 code.
    - The `application/usecase` package coordinates domain logic but also MUST NOT depend on infrastructure details.
    - The `adapter/in` package handles external input (e.g., REST controllers).
    - The `adapter/out` package handles external output (e.g., database, external APIs).
- **Dependency Rule:** Source code dependencies can only point *inward* toward the domain. Adapters depend on the domain, but the domain never depends on the adapters.

## 2. Code Quality & Formatting
- **Java Version:** Java 21 is the standard. Use modern language features:
    - Pattern matching for `switch` and `instanceof`.
    - Record classes for DTOs and immutable domain objects.
    - Sealed classes and interfaces for domain modeling.
    - Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`) where highly concurrent I/O is required.
- **Checkstyle:** The project uses a rigorous, custom Checkstyle configuration (`apps/api/config/checkstyle/checkstyle.xml`). All code MUST pass Checkstyle without warnings.
- **Naming Conventions:**
    - Classes: `PascalCase`
    - Methods/Variables: `camelCase`
    - Constants: `UPPER_SNAKE_CASE`
    - Interfaces: Do NOT prefix with `I` (e.g., use `PaymentProviderPort`, not `IPaymentProvider`).
    - Implementations: Do NOT suffix with `Impl` (e.g., use `MtnPaymentAdapter`, not `PaymentProviderImpl`).

## 3. Best Practices & Principles
- **Immutability:** Favour immutable objects. Use `record` wherever possible. Collections should be immutable by default (e.g., `List.copyOf()`).
- **Null Safety:** Avoid `null`. Use `Optional` as return types for methods that may not return a value. Do NOT pass `null` as arguments or use `Optional` as method parameters or fields.
- **Exceptions:** Use custom domain exceptions extending `RuntimeException`. Do not throw generic exceptions like `Exception` or `RuntimeException`. Always provide clear, actionable error messages.
- **Testing:**
    - Unit tests: Must cover the `domain` and `application` layers extensively. Use JUnit 5 and AssertJ.
    - Integration tests: Must cover the `adapter` layer. Use Testcontainers for real database and external API simulations (WireMock).
    - Code Coverage: Aim for >85% coverage on critical paths.
- **Security:**
    - Never log sensitive information (PII, API Keys, Tokens).
    - All endpoints must be secured by default.
    - Use OWASP Dependency-Check to prevent vulnerabilities.

## 4. Build System (Gradle)
- The project uses Gradle with Kotlin DSL (`build.gradle.kts`).
- Keep dependencies explicitly versioned, ideally using Gradle Catalogs or `dependencyManagement`.
- Run `./gradlew build` to verify compilation, tests, and static analysis before any commit.

## 5. Development Workflow
- When adding a feature:
    1. Define the Domain Model first.
    2. Write the Use Case (Application layer).
    3. Implement Ports (Interfaces).
    4. Build the Adapters (Web/Persistence/External).
    5. Write comprehensive tests.
- Provide clear, meaningful commit messages.
- Always run the CI/CD checks locally using the Gradle wrapper.
