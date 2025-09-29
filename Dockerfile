# ---- STAGE 1: Builder ----
FROM registery.fardup.ir:5000/node:22-alpine AS builder

WORKDIR /app

# فقط فایل‌های package رو اول کپی کن تا cache بهتر کار کنه
COPY package*.json ./

# اگر lockfile داری می‌تونی بجای install از ci استفاده کنی
RUN npm install --force --verbose

# سورس پروژه رو کامل کپی کن
COPY . .

# بیلد Next.js
RUN npm run build


# ---- STAGE 2: Runner ----
FROM registery.fardup.ir:5000/node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# یوزر امن ایجاد می‌کنیم
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# فقط خروجی‌های لازم رو کپی می‌کنیم
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# اجرای سرور Next.js
CMD ["node", "server.js"]