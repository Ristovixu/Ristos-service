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
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Laptop className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ремонт ноутбуков
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт ноутбуков всех брендов. Чистка, апгрейд, 
              замена комплектующих с гарантией до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1.5 часа</div>
              <div className="text-gray-600">Среднее время ремонта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12 мес</div>
              <div className="text-gray-600">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">400+</div>
              <div className="text-gray-600">Отремонтированных ноутбуков</div>
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
              Виды ремонта ноутбуков
            </h2>
            <p className="text-xl text-gray-600">
              Выполняем любые виды ремонта и модернизации
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
              Ремонтируем все бренды
            </h2>
            <p className="text-xl text-gray-600">
              Работаем с ноутбуками любых производителей
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
              Заказать ремонт ноутбука
            </h2>
            <p className="text-xl text-blue-100">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <ContactForm defaultDeviceType="laptop" />
          </div>
        </div>
      </section>
    </div>
  );
}