FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
RUN apk add --no-cache libc6-compat ca-certificates curl
COPY docker/certs/install-russian-ca.sh /tmp/install-russian-ca.sh
RUN chmod +x /tmp/install-russian-ca.sh && /tmp/install-russian-ca.sh && rm /tmp/install-russian-ca.sh
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/russian_trusted_ca.pem
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
