# Инструкция по использованию Docker

## Быстрый старт

### 1. Сборка образа

```bash
docker build -t techremont-web .
```

### 2. Запуск контейнера

```bash
docker run -d -p 3000:80 --name techremont-web techremont-web
```

Сайт будет доступен по адресу: `http://localhost:3000`

## Сборка с переменными окружения

Если нужно передать переменные окружения на этапе сборки:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=your_supabase_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_supabase_anon_key \
  -t techremont-web .
```

Или используйте файл `.env`:

```bash
# Создайте .env файл с переменными
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env

# Сборка с использованием .env
docker build --build-arg VITE_SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2) \
             --build-arg VITE_SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2) \
             -t techremont-web .
```

## Использование Docker Compose

### Базовое использование

```bash
# Запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f web

# Остановка
docker-compose down

# Пересборка и запуск
docker-compose up -d --build
```

### Изменение порта

Отредактируйте `docker-compose.yml` и измените строку:
```yaml
ports:
  - "8080:80"  # Вместо 3000:80
```

## Полезные команды

### Просмотр логов
```bash
docker logs techremont-web
docker logs -f techremont-web  # Следить за логами в реальном времени
```

### Остановка и удаление контейнера
```bash
docker stop techremont-web
docker rm techremont-web
```

### Удаление образа
```bash
docker rmi techremont-web
```

### Вход в контейнер
```bash
docker exec -it techremont-web sh
```

### Проверка здоровья
```bash
curl http://localhost:3000/health
```

## Развертывание на сервере

### 1. Копирование файлов на сервер

```bash
scp -r . user@server:/path/to/project
```

### 2. На сервере

```bash
cd /path/to/project
docker build -t techremont-web .
docker run -d -p 3000:80 --name techremont-web --restart unless-stopped techremont-web
```

### 3. С использованием Docker Compose

```bash
docker-compose up -d --build
```

## Troubleshooting

### Проблема: Сайт не открывается
- Проверьте, что контейнер запущен: `docker ps`
- Проверьте логи: `docker logs techremont-web`
- Убедитесь, что порт не занят: `netstat -tuln | grep 3000`

### Проблема: Переменные окружения не работают
- Убедитесь, что переменные переданы через `--build-arg` при сборке
- Проверьте, что переменные начинаются с `VITE_`
- Пересоберите образ с правильными аргументами

### Проблема: Ошибки при сборке
- Проверьте, что все файлы скопированы (особенно `package.json`)
- Убедитесь, что используется правильная версия Node.js (18+)
- Очистите кэш: `docker build --no-cache -t techremont-web .`

## Оптимизация

### Уменьшение размера образа
Образ уже оптимизирован с использованием:
- Multi-stage build (удаление node_modules из финального образа)
- Alpine Linux (минимальный размер)
- Nginx Alpine (легковесный веб-сервер)

### Кэширование слоев
Docker автоматически кэширует слои. Порядок в Dockerfile оптимизирован для максимального использования кэша.

