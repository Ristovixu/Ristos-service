-- Добавление новых таблиц для Ristos-service

-- 1. Таблица услуг (services)
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  price_from integer NOT NULL,
  icon_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO anon
  USING (true);

-- 2. Таблица отзывов (reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (is_published = true);

-- 3. Обновление таблицы заявок (repair_requests)
-- ТЗ требует: поля device_model, contact_method, price_estimate. Статусы: Принят, Диагностика, Согласование, В ремонте, Готов к выдаче, Выдан
ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS device_model text;
ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS contact_method text;
ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS price_estimate integer;

-- Для обновления статуса может потребоваться политика UPDATE для админов. 
-- Пока дадим возможность обновлять анонимам (демо).
CREATE POLICY "Anyone can update repair requests"
  ON repair_requests
  FOR UPDATE
  TO anon
  USING (true);
