# Инструкция по развертыванию на сервере через Docker

## Текущая конфигурация
- Сайт доступен: http://158.160.91.4:8000/ и http://ristos.dev-ops8.ru/
- Проект на GitLab: https://gitlab.dev-ops8.ru/

## Развертывание через Docker

### Вариант 1: Развертывание на порту 8000 (как сейчас)

#### 1. Подключение к серверу
```bash
ssh ваш-username@158.160.91.4
```

#### 2. Установка Docker (если не установлен)
```bash
# Обновление пакетов
sudo apt-get update

# Установка Docker
sudo apt-get install -y docker.io docker-compose

# Запуск Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавление пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER
# Выйдите и войдите снова, чтобы изменения вступили в силу
```

#### 3. Клонирование/обновление репозитория
```bash
cd ~
# Если репозиторий уже клонирован
cd ваш-репозиторий
git pull origin dev

# Или клонируйте заново
git clone https://gitlab.dev-ops8.ru/ваш-username/ваш-репозиторий.git
cd ваш-репозиторий
git checkout dev
```

#### 4. Создание файла с переменными окружения
```bash
# Создайте .env файл (если еще не создан)
nano .env
```

Добавьте в файл:
```
VITE_SUPABASE_URL=ваш_supabase_url
VITE_SUPABASE_ANON_KEY=ваш_supabase_anon_key
```

#### 5. Обновление docker-compose.yml для порта 8000
Отредактируйте `docker-compose.yml`:
```yaml
ports:
  - "8000:80"  # Измените с 3000:80 на 8000:80
```

#### 6. Сборка и запуск через Docker
```bash
# Остановите старый процесс (если запущен)
docker stop techremont-web 2>/dev/null || true
docker rm techremont-web 2>/dev/null || true

# Сборка образа с переменными окружения
docker build \
  --build-arg VITE_SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2) \
  --build-arg VITE_SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2) \
  -t techremont-web .

# Запуск контейнера
docker run -d -p 8000:80 --name techremont-web --restart unless-stopped techremont-web

# Или используйте docker-compose
docker-compose up -d --build
```

### Вариант 2: Использование docker-compose (рекомендуется)

#### 1. Обновите docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
    container_name: techremont-web
    ports:
      - "8000:80"  # Порт 8000 для соответствия текущей конфигурации
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### 2. Запуск
```bash
# Загрузка переменных из .env и запуск
docker-compose up -d --build
```

## Обновление сайта

### Автоматическое обновление через GitLab CI/CD (опционально)

Создайте файл `.gitlab-ci.yml` в корне проекта:

```yaml
stages:
  - deploy

deploy:
  stage: deploy
  script:
    - ssh ваш-username@158.160.91.4 "cd ~/ваш-репозиторий && git pull origin dev && docker-compose up -d --build"
  only:
    - dev
```

### Ручное обновление
```bash
# На сервере
cd ~/ваш-репозиторий
git pull origin dev
docker-compose down
docker-compose up -d --build
```

## Проверка работы

```bash
# Проверка статуса контейнера
docker ps

# Просмотр логов
docker logs techremont-web
docker logs -f techremont-web  # Следить за логами

# Проверка здоровья
curl http://localhost:8000/health

# Проверка доступности
curl http://localhost:8000
```

## Настройка домена ristos.dev-ops8.ru

Если нужно настроить домен для работы с Docker:

### Вариант 1: Nginx как reverse proxy (рекомендуется)

```bash
# Установка nginx на хосте
sudo apt-get install -y nginx

# Создание конфигурации
sudo nano /etc/nginx/sites-available/ristos.dev-ops8.ru
```

Добавьте:
```nginx
server {
    listen 80;
    server_name ristos.dev-ops8.ru;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/ristos.dev-ops8.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Вариант 2: Прямое подключение через порт 80

Измените в `docker-compose.yml`:
```yaml
ports:
  - "80:80"  # Вместо 8000:80
```

**Важно:** Убедитесь, что порт 80 свободен и открыт в firewall.

## Полезные команды

```bash
# Остановка контейнера
docker stop techremont-web

# Запуск контейнера
docker start techremont-web

# Перезапуск
docker restart techremont-web

# Удаление контейнера
docker rm -f techremont-web

# Удаление образа
docker rmi techremont-web

# Очистка неиспользуемых ресурсов
docker system prune -a
```

## Troubleshooting

### Проблема: Сайт не открывается
```bash
# Проверьте статус контейнера
docker ps -a

# Проверьте логи
docker logs techremont-web

# Проверьте порты
sudo netstat -tuln | grep 8000
```

### Проблема: Ошибки при сборке
```bash
# Очистите кэш и пересоберите
docker build --no-cache \
  --build-arg VITE_SUPABASE_URL=... \
  --build-arg VITE_SUPABASE_ANON_KEY=... \
  -t techremont-web .
```

### Проблема: Переменные окружения не работают
- Убедитесь, что переменные переданы через `--build-arg` при сборке
- Проверьте файл `.env` на сервере
- Пересоберите образ с правильными аргументами

## Автозапуск при перезагрузке сервера

Docker Compose с `restart: unless-stopped` автоматически запустит контейнер при перезагрузке.

Для дополнительной надежности:
```bash
# Создайте systemd service (опционально)
sudo nano /etc/systemd/system/techremont.service
```

```ini
[Unit]
Description=TechRemont Web Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ваш-username/ваш-репозиторий
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable techremont
sudo systemctl start techremont
```

