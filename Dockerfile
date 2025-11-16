# --- Base image with Node ---
FROM node:24-slim AS base

FROM base AS build

WORKDIR /usr/src/app
COPY ourharvia-app/ .

ENV CI=true

# Install dependencies using npm
RUN npm ci

# Build the app
RUN npm run build

# --- Runtime image ---
FROM node:24-alpine3.20 AS runtime

RUN npm i -g serve

WORKDIR /app

COPY --from=build /usr/src/app/dist /app

EXPOSE 3001

CMD ["serve", "-s", ".", "-l", "3001"]
