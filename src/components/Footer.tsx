import React from 'react';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Wrench className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">RISTOS</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Профессиональный ремонт техники с гарантией качества. 
              Работаем для вас каждый день!
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <a href="tel:+79612427551" className="hover:text-blue-400 transition-colors">
                  +7 (961) 242-75-51
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <a href="mailto:mewingbrn@gmail.com" className="hover:text-blue-400 transition-colors">
                  mewingbrn@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                <span>г. Барнаул</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Время работы</h3>
            <div className="space-y-2 text-gray-400">
              <div>Пн-Пт: 9:00 - 20:00</div>
              <div>Сб-Вс: 10:00 - 18:00</div>
              <div className="text-blue-400 font-semibold">
                Экстренный ремонт: 24/7
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RISTOS. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}