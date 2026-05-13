import React from 'react';
import { Laptop, CheckCircle, Star, Cpu, HardDrive, Monitor } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function LaptopsPage() {
  const services = [
    {
      title: "Замена клавиатуры",
      description: "Установка новой клавиатуры при повреждении клавиш",
      price: "от 2 800 ₽",
      time: "1-2 часа"
    },
    {
      title: "Чистка от пыли",
      description: "Профессиональная чистка системы охлаждения",
      price: "от 2 000 ₽",
      time: "1-1.5 часа"
    },
    {
      title: "Замена экрана",
      description: "Замена поврежденной матрицы ноутбука",
      price: "от 5 500 ₽",
      time: "2-3 часа"
    },
    {
      title: "Апгрейд SSD/RAM",
      description: "Увеличение объема памяти и скорости работы",
      price: "от 1 500 ₽",
      time: "30-60 мин"
    },
    {
      title: "Ремонт системы охлаждения",
      description: "Замена кулеров, термопасты, радиаторов",
      price: "от 3 200 ₽",
      time: "2-3 часа"
    },
    {
      title: "Ремонт материнской платы",
      description: "Микропайка и восстановление сложных поломок",
      price: "от 4 500 ₽",
      time: "4-8 часов"
    }
  ];

  const brands = [
    "ASUS",
    "Acer",
    "Lenovo",
    "HP",
    "Dell",
    "MSI",
    "Apple MacBook",
    "Samsung",
    "Toshiba",
    "Sony VAIO"
  ];

  const features = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Диагностика железа",
      description: "Полная проверка всех компонентов ноутбука"
    },
    {
      icon: <HardDrive className="h-8 w-8" />,
      title: "Восстановление данных",
      description: "Спасаем важные файлы с поврежденных дисков"
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Замена комплектующих",
      description: "Используем только качественные запчасти"
    }
  ];

  const testimonials = [
    {
      name: "Анна В.",
      text: "Почистили ноутбук от пыли, теперь не шумит и не греется. Работает как новый!",
      rating: 5
    },
    {
      name: "Сергей Л.",
      text: "Заменили экран на MacBook Pro. Качество отличное, гарантию дали на год.",
      rating: 5
    },
    {
      name: "Ольга М.",
      text: "Установили SSD вместо старого HDD. Ноутбук стал работать в разы быстрее!",
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/service-laptops.jpg" alt="Ремонт ноутбуков" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[var(--c-surface)]/10 backdrop-blur-sm p-4 rounded-full">
                <Laptop className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ремонт ноутбуков
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт ноутбуков всех брендов. Чистка, апгрейд, 
              замена комплектующих с гарантией до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1.5 часа</div>
              <div className="text-white/60">Среднее время ремонта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">12 мес</div>
              <div className="text-white/60">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">400+</div>
              <div className="text-white/60">Отремонтированных ноутбуков</div>
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
              Виды ремонта ноутбуков
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Выполняем любые виды ремонта и модернизации
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
              Ремонтируем все бренды
            </h2>
            <p className="text-xl text-[var(--c-ink-soft)]">
              Работаем с ноутбуками любых производителей
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
              Заказать ремонт ноутбука
            </h2>
            <p className="text-xl text-white/70">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-[var(--c-surface)] rounded-2xl shadow-xl shadow-black/30 p-8">
            <ContactForm defaultDeviceType="laptop" />
          </div>
        </div>
      </section>
    </div>
  );
}
