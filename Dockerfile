# ---- STAGE 1: Builder ----
FROM registery.fardup.ir:5000/node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://mirror-npm.runflare.com \
  && npm i --verbose --force

COPY . .

RUN rm -f .env.local

RUN npm run build

# ---- STAGE 2: Runner ----
FROM registery.fardup.ir:5000/node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]