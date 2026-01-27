# Install dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the application
FROM oven/bun:1-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ="Asia/Jakarta"

# Only copy necessary files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts

# Install only essential runtime dependencies
RUN apk add --no-cache curl

# Security and persistent storage setup
RUN addgroup -g 1001 -S bunjs && \
  adduser -S nextjs -u 1001 && \
  mkdir -p public/uploads && \
  chown -R nextjs:bunjs /app

USER nextjs

EXPOSE 3000

# Reliable healthcheck using curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["bun", "run", "server.js"]
