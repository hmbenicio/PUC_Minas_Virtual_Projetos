# Multi-stage Dockerfile for Next.js frontend (production)

FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=""
ENV NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=${NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build with Turbopack as defined in package.json
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Reuse installed deps and prune devDependencies for smaller runtime
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy build output and minimal runtime files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]

