
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


# Create app directory
WORKDIR /app

# Copy our package files as usual
COPY package*.json pnpm-lock.yaml /app/

# Install dependencies with pnpm and cache mount
RUN --mount=type=cache,id=pnmcache,target=/pnpm_store \
  pnpm config set store-dir /pnpm_store && \
  pnpm config set package-import-method copy && \
  pnpm install --prefer-offline --ignore-scripts --frozen-lockfile


# Bundle app source
COPY . /app

EXPOSE 9000
CMD [ "node", "server.js" ]