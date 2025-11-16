# Base stage
FROM node:24-slim AS base

WORKDIR /usr/src/app
COPY ourharvia-app/ .

# Install dependencies using npm
RUN npm install

# Build stage
FROM base AS build

WORKDIR /usr/src/app
ENV CI=true

RUN npm run build

# Runtime stage
FROM node:24-alpine3.20 AS runtime

# Install serve globally
RUN npm install -g serve

WORKDIR /app
COPY --from=build /usr/src/app/dist /app

EXPOSE 3001
CMD ["serve", "-s", ".", "-l", "3001"]
