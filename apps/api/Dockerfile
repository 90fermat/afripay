# ============================================================
# AfriDevPay API — Production Dockerfile
# Multi-stage build: builder → runner
# Final image: ~200MB, non-root user, health check included
# ============================================================

# ── Stage 1: Build ────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B -q

COPY src ./src
RUN ./mvnw package -DskipTests -B -q && \
    java -Djarmode=layertools -jar target/*.jar extract

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runner

RUN addgroup -S afripay && adduser -S afripay -G afripay

WORKDIR /app

COPY --from=builder /build/dependencies/          ./
COPY --from=builder /build/spring-boot-loader/    ./
COPY --from=builder /build/snapshot-dependencies/ ./
COPY --from=builder /build/application/           ./

RUN chown -R afripay:afripay /app
USER afripay

ENV JAVA_OPTS="\
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -XX:+UseZGC \
  -XX:+ZGenerational \
  -Djava.security.egd=file:/dev/./urandom \
  -Dfile.encoding=UTF-8 \
  -Duser.timezone=UTC"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
