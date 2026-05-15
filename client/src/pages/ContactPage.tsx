import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ContactPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Decorative Page Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[var(--c-accent)]/5 to-transparent -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[300px] bg-[radial-gradient(circle_at_top,var(--c-accent)_0%,transparent_70%)] opacity-[0.03] -z-10" />

      <div className="container-grid pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display text-5xl mb-12"
          >
            Контакты
          </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--c-surface)] flex items-center justify-center flex-shrink-0 border border-[var(--c-border)]">
                <MapPin className="w-6 h-6 text-[var(--c-accent)]" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-2">Наш адрес</h3>
                <p className="text-[var(--c-ink-soft)] font-light leading-relaxed">
                  г. Москва, ул. Профсоюзная, д. 56<br />
                  ТЦ «Черемушки», 2 этаж, пав. 24
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--c-surface)] flex items-center justify-center flex-shrink-0 border border-[var(--c-border)]">
                <Phone className="w-6 h-6 text-[var(--c-accent)]" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-2">Телефоны</h3>
                <p className="text-[var(--c-ink-soft)] font-light leading-relaxed">
                  +7 (495) 123-45-67<br />
                  +7 (926) 000-00-00
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--c-surface)] flex items-center justify-center flex-shrink-0 border border-[var(--c-border)]">
                <Clock className="w-6 h-6 text-[var(--c-accent)]" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-2">Режим работы</h3>
                <p className="text-[var(--c-ink-soft)] font-light leading-relaxed">
                  Ежедневно: 10:00 — 21:00<br />
                  Без перерывов и выходных
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--c-surface)] p-8 md:p-10 rounded-3xl border border-[var(--c-border)]">
            <h3 className="font-display text-2xl mb-6">Напишите нам</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--c-ink-ghost)]">Ваше имя</label>
                <input className="w-full bg-transparent border-b border-[var(--c-border)] py-2 outline-none focus:border-[var(--c-accent)] transition-colors" placeholder="Иван" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--c-ink-ghost)]">Телефон или Email</label>
                <input className="w-full bg-transparent border-b border-[var(--c-border)] py-2 outline-none focus:border-[var(--c-accent)] transition-colors" placeholder="+7 (900) 000-00-00" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--c-ink-ghost)]">Сообщение</label>
                <textarea className="w-full bg-transparent border-b border-[var(--c-border)] py-2 outline-none focus:border-[var(--c-accent)] transition-colors resize-none h-24" placeholder="Как мы можем вам помочь?" />
              </div>
              <Button variant="primary" className="w-full">Отправить сообщение</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

export default ContactPage;