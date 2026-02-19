# =============================================================================
# Bank GreenDrive — Multi-stage Production Dockerfile
# Bank-grade: non-root user, minimal attack surface, health checks, read-only FS
# OCI-compliant labels for container governance and traceability
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Install dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine3.21 AS deps

RUN apk upgrade --no-cache
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

# ---------------------------------------------------------------------------
# Stage 2: Build frontend assets
# ---------------------------------------------------------------------------
FROM node:20-alpine3.21 AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: Production image — minimal footprint
# ---------------------------------------------------------------------------
FROM node:20-alpine3.21 AS production

# OCI-compliant image labels — container governance & traceability
LABEL org.opencontainers.image.title="Bank GreenDrive"
LABEL org.opencontainers.image.description="Data-Driven Green Finance Application"
LABEL org.opencontainers.image.vendor="Bank"
LABEL org.opencontainers.image.authors="engineering@middleleap.com"
LABEL org.opencontainers.image.source="https://github.com/middleleap/greendrive"
LABEL org.opencontainers.image.documentation="https://github.com/middleleap/greendrive"
LABEL org.opencontainers.image.licenses="Proprietary"
LABEL org.opencontainers.image.base.name="node:20-alpine3.21"
LABEL com.bank.compliance.classification="internal"
LABEL com.bank.compliance.data-sensitivity="confidential"

# Security: upgrade all OS packages to latest patched versions
RUN apk upgrade --no-cache

# Security: add non-root user
RUN addgroup -g 1001 -S greendrive && \
    adduser -S greendrive -u 1001 -G greendrive

# Security: install dumb-init for proper signal handling (PID 1 problem)
RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Copy production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy server code and built frontend
COPY --from=build /app/dist ./dist
COPY server ./server
COPY .well-known ./.well-known

# Create writable data directory for SQLite
RUN mkdir -p /app/data

# Remove write permissions where possible
RUN chown -R greendrive:greendrive /app

# Drop to non-root user
USER greendrive

# Environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Health check — container orchestrators use this
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/ || exit 1

# Use dumb-init to handle signals correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
