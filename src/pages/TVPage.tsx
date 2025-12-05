import React from 'react';
import { Monitor, CheckCircle, Star, Zap } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function TVPage() {
  const services = [
    {
      title: "Замена матрицы",
      description: "Замена поврежденных экранов LED, OLED, QLED телевизоров",
      price: "от 8 000 ₽",
      time: "2-4 часа"
    },
    {
      title: "Ремонт блока питания",
      description: "Диагностика и ремонт источников питания",
      price: "от 3 500 ₽",
      time: "1-2 часа"
    },
    {
      title: "Замена подсветки",
      description: "Восстановление LED подсветки экрана",
      price: "от 4 500 ₽",
      time: "2-3 часа"
    },
    {
      title: "Ремонт материнской платы",
      description: "Восстановление основной платы управления",
      price: "от 5 000 ₽",
      time: "3-6 часов"
    },
    {
      title: "Настройка Smart TV",
      description: "Настройка интернета, приложений, каналов",
      price: "от 1 500 ₽",
      time: "30-60 мин"
    },
    {
      title: "Замена разъемов",
      description: "Ремонт HDMI, USB и других портов",
      price: "от 2 500 ₽",
      time: "1-2 часа"
    }
  ];

  const brands = [
    "Samsung",
    "LG",
    "Sony",
    "Philips",
    "TCL",
    "Hisense",
    "Panasonic",
    "Sharp",
    "Toshiba",
    "Xiaomi"
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Выездной ремонт",
      description: "Приезжаем к вам домой с необходимым оборудованием"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Диагностика бесплатно",
      description: "Определяем причину поломки без дополнительной платы"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Оригинальные запчасти",
      description: "Используем только качественные комплектующие"
    }
  ];

  const testimonials = [
    {
      name: "Владимир С.",
      text: "Отремонтировали Samsung 55 дюймов. Мастер приехал в тот же день, все сделал быстро и качественно.",
      rating: 5
    },
    {
      name: "Елена Р.",
      text: "LG перестал включаться. Заменили блок питания, теперь работает как новый. Спасибо!",
      rating: 5
    },
    {
      name: "Игорь К.",
      text: "Настроили Smart TV и все приложения. Очень доволен сервисом!",
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
                <Monitor className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ремонт телевизоров
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Профессиональный ремонт телевизоров всех брендов и диагоналей. 
              Выездной сервис с гарантией качества до 12 месяцев.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2 часа</div>
              <div className="text-gray-600">Среднее время ремонта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12 мес</div>
              <div className="text-gray-600">Гарантия на работы</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">300+</div>
              <div className="text-gray-600">Отремонтированных ТВ</div>
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
              Виды ремонта телевизоров
            </h2>
            <p className="text-xl text-gray-600">
              Выполняем полный спектр ремонтных работ
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
              Работаем с телевизорами любых производителей
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
              Заказать ремонт телевизора
            </h2>
            <p className="text-xl text-blue-100">
              Оставьте заявку и мы приедем к вам домой для диагностики
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <ContactForm defaultDeviceType="tv" />
          </div>
        </div>
      </section>
    </div>
  );
}