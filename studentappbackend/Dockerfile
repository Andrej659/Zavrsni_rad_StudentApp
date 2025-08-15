# Koristi JDK 21 image
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY studentappbackend /app

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY --from=build /app/target/studentappbackend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
