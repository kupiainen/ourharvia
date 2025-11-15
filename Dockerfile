# --- Base image with pnpm and corepack ---
FROM node:24-slim AS base

ENV PNPM_HOME="/ourharvia-app"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /usr/src/app
COPY ourharvia-app/ .

ENV CI=true

RUN --mount=type=cache,id=pnpm,target=${PNPM_HOME}/pnpm/store pnpm install --frozen-lockfile
RUN pnpm unsafe-build

FROM node:24-alpine3.20 AS runtime

RUN npm i -g serve

WORKDIR /app
COPY --from=build /usr/src/app/dist /app

EXPOSE 3001
CMD ["serve", "-s", ".", "-l", "3001"]
