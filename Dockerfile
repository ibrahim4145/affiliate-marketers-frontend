# syntax=docker/dockerfile:1

# 1) Install dependencies using a lightweight base
FROM node:20-alpine AS deps
WORKDIR /app

# Install OS deps for sharp/next (if ever needed)
RUN apk add --no-cache libc6-compat

# Copy only package files to leverage Docker layer caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Prefer npm if lock exists; adjust if you use yarn/pnpm
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i; fi

# 2) Build the project
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with the provided env; NEXT_PUBLIC_* must be passed at build or runtime for SSG
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# 3) Run with a minimal image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Set a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy necessary build output and minimal files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Next.js listens on 3000 by default
EXPOSE 3000

# Enable standalone output if configured; otherwise default start
ENV PORT=3000

USER nextjs

CMD ["npm", "start"]
