# Stage 1: сборка (если есть фронтенд на React/Vue/Svelte)
# Уберите этот stage, если у вас только бэкенд (чистый Express/Nest/etc.)
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Если есть фронтенд (например, React в папке client/)
# COPY client ./client
# RUN cd client && npm ci && npm run build


# Stage 2: финальный образ
FROM node:20-alpine

# Безопасность: не root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    mkdir -p /app && chown -R nextjs:nodejs /app
USER nextjs

WORKDIR /app

# Копируем зависимости и код
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Если есть фронтенд — копируем билд (пример для React):
# COPY --from=builder /app/client/build ./public

# Порт приложения
EXPOSE 3000

# Запуск
CMD ["node", "server.js"]
# Или: CMD ["npm", "start"]