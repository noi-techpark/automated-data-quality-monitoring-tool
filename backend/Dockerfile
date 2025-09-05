FROM node:24-alpine
WORKDIR /
COPY . .
RUN apk add python3 make g++
RUN npm ci
CMD ["sh", "-c", "until nc -z postgres 5432; do echo 'Waiting for DB...'; sleep 3; done; npx prisma db push --schema=./prisma/schema.prisma --skip-generate --accept-data-loss && npm run start"]