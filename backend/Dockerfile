# Multi-stage build for minimal production image
# Stage 1: Build with Maven (includes dev dependencies, JDK)
# Stage 2: Runtime with JRE only (smaller, no build tools)
#
# Alpine Linux base for smaller footprint (~50MB vs ~300MB for debian)
# Non-root user for security (containers should not run as root)

FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
