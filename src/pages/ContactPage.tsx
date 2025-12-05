import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Телефон",
      content: "+7 (961) 242-75-51",
      link: "tel:+79612427551"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      content: "mewingbrn@gmail.com",
      link: "mailto:mewingbrn@gmail.com"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Адрес",
      content: "г. Барнаул",
      link: null
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Время работы",
      content: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
      link: null
    }
  ];

  const advantages = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Быстрый отклик",
      description: "Отвечаем на заявки в течение 15 минут"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Консультации",
      description: "Бесплатные консультации по телефону"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Выездной сервис",
      description: "Приезжаем к вам домой или в офис"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Готовы помочь с ремонтом вашей техники. Оставьте заявку или позвоните нам прямо сейчас!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a 
                    href={info.link} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
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
              Оставьте заявку
            </h2>
            <p className="text-xl text-blue-100">
              Заполните форму и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Экстренный ремонт 24/7
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Если ваша техника сломалась в неподходящий момент, мы готовы помочь в любое время
          </p>
          <a 
            href="tel:+79612427551"
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center"
          >
            <Phone className="mr-2 h-5 w-5" />
            Экстренный вызов: +7 (961) 242-75-51
          </a>
        </div>
      </section>
    </div>
  );
}