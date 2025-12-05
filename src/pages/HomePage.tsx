import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Monitor, 
  Laptop, 
  HardDrive, 
  CheckCircle, 
  Clock, 
  Shield, 
  DollarSign,
  Phone,
  Star,
  Users,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function HomePage() {
  const services = [
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: "Ремонт смартфонов",
      description: "Замена экранов, батарей, камер. Любые модели iPhone, Samsung, Xiaomi и других брендов",
      link: "/smartphones"
    },
    {
      icon: <Monitor className="h-12 w-12" />,
      title: "Ремонт телевизоров",
      description: "Диагностика и ремонт LED, OLED, QLED телевизоров всех размеров и брендов",
      link: "/tv"
    },
    {
      icon: <Laptop className="h-12 w-12" />,
      title: "Ремонт ноутбуков",
      description: "Профессиональный ремонт ноутбуков, чистка от пыли, замена комплектующих",
      link: "/laptops"
    },
    {
      icon: <HardDrive className="h-12 w-12" />,
      title: "Ремонт ПК",
      description: "Диагностика, ремонт и сборка компьютеров. Восстановление данных",
      link: "/computers"
    }
  ];

  const advantages = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Быстрый ремонт",
      description: "Большинство ремонтов выполняем в день обращения"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Гарантия качества",
      description: "Даем гарантию на все виды работ до 12 месяцев"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Честные цены",
      description: "Фиксированные цены, никаких скрытых доплат"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Опытные мастера",
      description: "Команда сертифицированных специалистов с опытом 5+ лет"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Профессиональный
                <span className="text-blue-600 block">ремонт техники</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Качественный ремонт смартфонов, ноутбуков, телевизоров и компьютеров в выездном формате. 
                Гарантия до 12 месяцев. Работаем быстро и недорого! 
                Оставьте заявку и мастер приедет в течение пары часов.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/contact" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center"
                >
                  Заказать ремонт
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="tel:+79612427551" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  +7 (961) 242-75-51
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-gray-600 text-sm">Довольных клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3 года</div>
                  <div className="text-gray-600 text-sm">На рынке</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99%</div>
                  <div className="text-gray-600 text-sm">Успешных ремонтов</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-2xl transform rotate-3">
                <div className="bg-white p-6 rounded-xl transform -rotate-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <span className="font-semibold">Ремонт выполнен</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    "Отличный сервис! iPhone отремонтировали за 2 часа, 
                    работает как новый. Спасибо!"
                  </p>
                  <div className="text-sm text-gray-500">Анна К., клиент</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наши услуги
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Профессиональный ремонт любой сложности с гарантией качества
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link 
                key={index}
                to={service.link}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Подробнее
                  <ChevronRight className="ml-2 h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы обеспечиваем высочайший уровень сервиса и качества
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <div className="text-blue-600 group-hover:text-white transition-colors">
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

      {/* Quick Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Оставьте заявку на ремонт
            </h2>
            <p className="text-xl text-blue-100">
              Мы свяжемся с вами в течение 15 минут и договоримся о ремонте
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}