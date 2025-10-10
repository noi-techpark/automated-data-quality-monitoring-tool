# SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
#
# SPDX-License-Identifier: CC0-1.0

FROM maven:3-eclipse-temurin-21-alpine AS build-env

WORKDIR /app
COPY ./webapp/pom.xml .
COPY ./webapp/tsconfig.json .
COPY ./webapp/package.json .
COPY ./webapp/src /app/src

RUN apk add nodejs npm
RUN npm install
RUN npm run build

RUN mvn clean package

FROM jetty:12-jdk21-alpine AS build
WORKDIR /var/lib/jetty
RUN echo "--module=ee10-deploy" > start.d/deploy.ini
COPY --from=build-env /app/target/*.war webapps/ROOT.war
