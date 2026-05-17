import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[var(--c-border)] bg-[var(--c-bg)]">
      <div className="container-grid section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-[22px] font-semibold text-[var(--c-ink)] tracking-tight">
                PixelFix
              </span>
            </Link>
            <p className="text-[var(--c-ink-soft)] font-light text-[15px] max-w-sm leading-relaxed">
              Профессиональный ремонт техники с гарантией качества. Работаем с 2018 года — более 10 000 успешных ремонтов.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="eyebrow mb-6">Навигация</h3>
            <ul className="space-y-3">
              {[
                { name: 'Услуги и цены', path: '/services' },
                { name: 'Статус заказа', path: '/status' },
                { name: 'Оформить заявку', path: '/order' },
                { name: 'Личный кабинет', path: '/cabinet' },
                { name: 'Панель управления', path: '/admin' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[var(--c-ink-soft)] hover:text-[var(--c-ink)] text-[15px] font-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow mb-6">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[var(--c-ink-soft)] text-[15px] font-light">
                <MapPin className="w-4 h-4 mt-1 text-[var(--c-accent)] shrink-0" />
                г. Москва, ул. Техническая, 42
              </li>
              <li className="flex items-center gap-3 text-[var(--c-ink-soft)] text-[15px] font-light">
                <Phone className="w-4 h-4 text-[var(--c-accent)] shrink-0" />
                +7 (999) 123-45-67
              </li>
              <li className="flex items-center gap-3 text-[var(--c-ink-soft)] text-[15px] font-light">
                <Mail className="w-4 h-4 text-[var(--c-accent)] shrink-0" />
                info@pixelfix.ru
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--c-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--c-ink-ghost)] text-[var(--t-small)]">
            © {new Date().getFullYear()} PixelFix. Все права защищены.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-[var(--c-ink-ghost)] hover:text-[var(--c-ink-soft)] text-[var(--t-small)] transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};