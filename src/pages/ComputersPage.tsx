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
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <HardDrive className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ремонт компьютеров
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт и сборка компьютеров. Диагностика, апгрейд, 
              восстановление данных с гарантией до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1 час</div>
              <div className="text-gray-600">Среднее время диагностики</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12 мес</div>
              <div className="text-gray-600">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">600+</div>
              <div className="text-gray-600">Отремонтированных ПК</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Виды ремонта компьютеров
            </h2>
            <p className="text-xl text-gray-600">
              Выполняем полный спектр работ с компьютерной техникой
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{service.price}</div>
                    <div className="text-sm text-gray-500">{service.time}</div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Работаем с лучшими брендами
            </h2>
            <p className="text-xl text-gray-600">
              Используем качественные комплектующие проверенных производителей
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-800">{brand}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-gray-600">
              Что говорят о нашей работе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Заказать ремонт компьютера
            </h2>
            <p className="text-xl text-blue-100">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <ContactForm defaultDeviceType="pc" />
          </div>
        </div>
      </section>
    </div>
  );
}