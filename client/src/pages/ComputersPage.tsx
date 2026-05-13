import React from 'react';
import { HardDrive, CheckCircle, Star, Cpu, Monitor, Zap } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function ComputersPage() {
  const services = [
    {
      title: "Диагностика железа",
      description: "Полная проверка всех компонентов системного блока",
      price: "от 1 000 ₽",
      time: "30-60 мин"
    },
    {
      title: "Чистка от вирусов",
      description: "Удаление вредоносного ПО и защита системы",
      price: "от 1 500 ₽",
      time: "1-2 часа"
    },
    {
      title: "Замена комплектующих",
      description: "Установка новых процессоров, видеокарт, памяти",
      price: "от 2 000 ₽",
      time: "1-3 часа"
    },
    {
      title: "Сборка ПК",
      description: "Сборка компьютера под ваши задачи и бюджет",
      price: "от 3 000 ₽",
      time: "2-4 часа"
    },
    {
      title: "Установка ПО",
      description: "Установка операционной системы и программ",
      price: "от 1 200 ₽",
      time: "1-2 часа"
    },
    {
      title: "Восстановление данных",
      description: "Восстановление файлов с поврежденных дисков",
      price: "от 2 500 ₽",
      time: "2-6 часов"
    }
  ];

  const brands = [
    "Intel",
    "AMD",
    "NVIDIA",
    "ASUS",
    "MSI",
    "Gigabyte",
    "ASRock",
    "Corsair",
    "Kingston",
    "Western Digital"
  ];

  const features = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Апгрейд системы",
      description: "Модернизация компьютера для повышения производительности"
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Настройка системы",
      description: "Оптимизация работы Windows и установка драйверов"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Экстренный ремонт",
      description: "Быстрое восстановление работоспособности ПК"
    }
  ];

  const testimonials = [
    {
      name: "Максим Р.",
      text: "Собрали игровой компьютер под мой бюджет. Все работает отлично, цены адекватные!",
      rating: 5
    },
    {
      name: "Татьяна К.",
      text: "Почистили компьютер от вирусов, установили антивирус. Теперь работает быстро.",
      rating: 5
    },
    {
      name: "Андрей П.",
      text: "Восстановили данные с поврежденного диска. Думал все потерял, но мастера спасли!",
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/service-diagnostics.jpg" alt="Диагностика компьютеров" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[var(--c-surface)]/10 backdrop-blur-sm p-4 rounded-full">
                <HardDrive className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ремонт компьютеров
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт и сборка компьютеров. Диагностика, апгрейд, 
              восстановление данных с гарантией до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1 час</div>
              <div className="text-white/60">Среднее время диагностики</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">12 мес</div>
              <div className="text-white/60">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">600+</div>
              <div className="text-white/60">Отремонтированных ПК</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--c-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-[var(--c-accent)]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[var(--c-ink)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--c-ink-soft)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[var(--c-surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--c-ink)] mb-4">
              Виды ремонта компьютеров
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Выполняем полный спектр работ с компьютерной техникой
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[var(--c-surface)] p-6 rounded-xl hover:shadow-xl hover:shadow-black/20 transition-shadow">
                <h3 className="text-xl font-bold text-[var(--c-ink)] mb-3">
                  {service.title}
                </h3>
                <p className="text-[var(--c-ink-soft)] mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-[var(--c-accent)]">{service.price}</div>
                    <div className="text-sm text-[var(--c-ink-ghost)]">{service.time}</div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-[var(--c-status-done)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-[var(--c-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--c-ink)] mb-4">
              Работаем с лучшими брендами
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Используем качественные комплектующие проверенных производителей
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="bg-[var(--c-surface-2)] p-4 rounded-lg text-center hover:shadow-lg hover:shadow-black/10 transition-shadow">
                <div className="font-semibold text-[var(--c-ink)]">{brand}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--c-surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--c-ink)] mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Что говорят о нашей работе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[var(--c-surface)] p-6 rounded-xl shadow-md shadow-black/20">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[var(--c-accent-alt)] fill-current" />
                  ))}
                </div>
                <p className="text-[var(--c-ink-soft)] mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-[var(--c-ink)]">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[var(--c-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Заказать ремонт компьютера
            </h2>
            <p className="text-xl text-white/70">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-2xl shadow-xl shadow-black/30 p-8">
            <ContactForm defaultDeviceType="pc" />
          </div>
        </div>
      </section>
    </div>
  );
}
