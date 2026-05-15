import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const Header = () => {
  const { isAuthenticated, client } = useSelector((state: RootState) => state.clientAuth);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Услуги', path: '/services' },
    { name: 'Статус заказа', path: '/status' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[rgba(12,20,33,0.88)] backdrop-blur-[20px] border-b border-[var(--c-border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-grid h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-[22px] font-semibold text-[var(--c-ink)] tracking-tight">
              TechRepair
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body font-light text-[15px] transition-colors relative pb-1 ${
                  location.pathname === link.path
                    ? 'text-[var(--c-ink)]'
                    : 'text-[var(--c-ink-soft)] hover:text-[var(--c-ink)]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--c-accent)]"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to={isAuthenticated ? "/cabinet" : "/cabinet/login"}>
              <button className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[var(--c-ink-soft)] hover:text-[var(--c-ink)] transition-colors">
                <UserIcon size={18} />
                <span>{isAuthenticated ? 'Кабинет' : 'Войти'}</span>
              </button>
            </Link>
            <Link to="/order">
              <Button variant="primary" withArrow>Оставить заявку</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-[var(--c-ink)]"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[var(--c-bg)]/98 backdrop-blur-xl flex flex-col"
          >
            <div className="container-grid h-20 flex items-center justify-between">
              <span className="font-display text-[22px] font-semibold text-[var(--c-ink)] tracking-tight">
                TechRepair
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-[var(--c-ink)]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center container-grid gap-8">
              {[
                { name: 'Главная', path: '/' },
                ...navLinks,
                { name: isAuthenticated ? 'Личный кабинет' : 'Войти', path: isAuthenticated ? '/cabinet' : '/cabinet/login' },
                { name: 'Оставить заявку', path: '/order' }
              ].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.path}
                    className="font-display text-[clamp(32px,6vw,48px)] font-light text-[var(--c-ink-soft)] hover:text-[var(--c-accent)] transition-colors leading-tight"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};