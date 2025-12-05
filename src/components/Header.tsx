import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Phone } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Wrench className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">RISTOS</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Главная
            </Link>
            <Link 
              to="/smartphones" 
              className={`transition-colors ${isActive('/smartphones') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Смартфоны
            </Link>
            <Link 
              to="/tv" 
              className={`transition-colors ${isActive('/tv') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Телевизоры
            </Link>
            <Link 
              to="/laptops" 
              className={`transition-colors ${isActive('/laptops') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Ноутбуки
            </Link>
            <Link 
              to="/computers" 
              className={`transition-colors ${isActive('/computers') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Компьютеры
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Контакты
            </Link>
            <a 
              href="tel:+79612427551" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Позвонить
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <a 
              href="tel:+79612427551" 
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}