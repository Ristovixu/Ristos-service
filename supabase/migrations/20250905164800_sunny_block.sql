/*
  # Создание таблицы заявок на ремонт

  1. Новые таблицы
    - `repair_requests`
      - `id` (uuid, primary key)
      - `name` (text) - имя клиента
      - `phone` (text) - номер телефона
      - `device_type` (text) - тип устройства
      - `problem` (text) - описание проблемы
      - `status` (text) - статус заявки
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `repair_requests`
    - Добавить политику для чтения всех записей (для мастеров)
    - Добавить политику для создания записей (для клиентов)
*/

CREATE TABLE IF NOT EXISTS repair_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  device_type text,
  problem text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;

-- Политика для создания заявок (доступно всем)
CREATE POLICY "Anyone can create repair requests"
  ON repair_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Политика для чтения заявок (доступно всем для демонстрации)
CREATE POLICY "Anyone can read repair requests"
  ON repair_requests
  FOR SELECT
  TO anon
  USING (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_repair_requests_updated_at
  BEFORE UPDATE ON repair_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();