import React from 'react';
import { Smartphone, CheckCircle, Star, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function SmartphonesPage() {
  const services = [
    {
      title: "Замена экрана",
      description: "Замена разбитых дисплеев на оригинальные или качественные аналоги",
      price: "от 2 500 ₽",
      time: "30-60 мин"
    },
    {
      title: "Замена аккумулятора",
      description: "Установка новой батареи для восстановления автономности",
      price: "от 1 800 ₽",
      time: "20-30 мин"
    },
    {
      title: "Ремонт после воды",
      description: "Диагностика и восстановление после попадания влаги",
      price: "от 3 000 ₽",
      time: "2-4 часа"
    },
    {
      title: "Замена камеры",
      description: "Ремонт основной и фронтальной камер",
      price: "от 2 200 ₽",
      time: "40-60 мин"
    },
    {
      title: "Ремонт разъемов",
      description: "Замена разъема зарядки, аудио и других портов",
      price: "от 1 500 ₽",
      time: "30-45 мин"
    },
    {
      title: "Ремонт материнской платы",
      description: "Микропайка и восстановление сложных поломок",
      price: "от 4 000 ₽",
      time: "4-8 часов"
    }
  ];

  const brands = [
    "iPhone (все модели)",
    "Samsung Galaxy",
    "Xiaomi / Redmi",
    "Huawei / Honor",
    "OnePlus",
    "Google Pixel",
    "Sony Xperia",
    "LG",
    "Meizu",
    "Realme"
  ];

  const testimonials = [
    {
      name: "Алексей М.",
      text: "Разбил экран iPhone 13. Заменили за час, работает отлично!",
      rating: 5
    },
    {
      name: "Мария К.",
      text: "Быстро заменили батарею в Samsung. Теперь держит весь день.",
      rating: 5
    },
    {
      name: "Дмитрий П.",
      text: "Восстановили телефон после воды. Думал уже не спасти.",
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/service-smartphones.jpg" alt="Ремонт смартфонов" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[var(--c-surface)]/10 backdrop-blur-sm p-4 rounded-full">
                <Smartphone className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ремонт смартфонов
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт смартфонов любых брендов и моделей. 
              Используем только качественные запчасти с гарантией до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30 мин</div>
              <div className="text-white/60">Среднее время ремонта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">12 мес</div>
              <div className="text-white/60">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/60">Отремонтированных телефонов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[var(--c-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--c-ink)] mb-4">
              Виды ремонта смартфонов
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Выполняем любые виды ремонта с использованием профессионального оборудования
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[var(--c-surface-2)] p-6 rounded-md hover:shadow-xl hover:shadow-black/20 transition-shadow">
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
      <section className="py-20 bg-[var(--c-surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--c-ink)] mb-4">
              Ремонтируем все бренды
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Работаем с любыми моделями смартфонов
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="bg-[var(--c-surface)] p-4 rounded-md text-center hover:shadow-lg hover:shadow-black/10 transition-shadow">
                <div className="font-semibold text-[var(--c-ink)]">{brand}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--c-surface)]">
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
              <div key={index} className="bg-[var(--c-surface-2)] p-6 rounded-md">
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
              Заказать ремонт смартфона
            </h2>
            <p className="text-xl text-white/70">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-md shadow-xl shadow-black/30 p-8">
            <ContactForm defaultDeviceType="smartphone" />
          </div>
        </div>
      </section>
    </div>
  );
}
