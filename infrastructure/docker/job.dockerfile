FROM node:24-alpine AS base
WORKDIR /
COPY job/ .
RUN apk add python3 make g++
RUN npm ci

FROM base AS build
CMD ["sh", "-c", "npm run start"]

FROM base AS dev
CMD ["sh", "-c", "until nc -z postgres 5432; do echo 'Waiting for DB...'; sleep 3; done; npx prisma db push --schema=./prisma/schema.prisma --skip-generate --accept-data-loss && npm run start"]