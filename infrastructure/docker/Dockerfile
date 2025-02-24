FROM maven:3-eclipse-temurin-21-alpine AS build-env

WORKDIR /app
COPY pom.xml .
COPY tsconfig.json .
COPY package.json .
COPY ./src /app/src

RUN apk add nodejs npm
RUN npm install
RUN npx tsc

RUN mvn clean package

FROM jetty:12-jdk21-alpine AS build
WORKDIR /var/lib/jetty
RUN echo "--module=ee10-deploy" > start.d/deploy.ini
COPY --from=build-env /app/target/*.war webapps/ROOT.war
