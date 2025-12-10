# Multi-stage build для React + Vite приложения

# Stage 1: Сборка приложения
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Аргументы для переменных окружения (опционально)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Установка переменных окружения для сборки
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Сборка приложения
RUN npm run build

# Stage 2: Production образ с nginx
FROM nginx:alpine

# Копирование собранных файлов из builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование кастомной конфигурации nginx (если есть)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]

