import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ease = { out: [0.16, 1, 0.3, 1] as const };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }
};

const contacts = [
  { icon: <MapPin />, title: 'Адрес', value: 'г. Москва, ул. Техническая, 42', sub: 'Вход со стороны двора, 2 этаж' },
  { icon: <Phone />, title: 'Телефон', value: '+7 (999) 123-45-67', sub: 'Ежедневно с 9:00 до 21:00' },
  { icon: <Mail />, title: 'Почта', value: 'info@techrepair.ru', sub: 'Ответим в течение часа' },
  { icon: <Clock />, title: 'Режим работы', value: 'Пн–Сб: 9:00 – 21:00', sub: 'Вс: 10:00 – 18:00' },
];

export const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
      className="pt-32"
    >
      {/* Facade image */}
      <div className="container-grid section-padding pb-0">
        <div className="h-[320px] md:h-[400px] overflow-hidden">
          <img
            src="/images/contact-facade.jpg"
            alt="Фасад мастерской — вывеска, вход"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="container-grid section-padding">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Контакты</p>
            <h1 className="text-display mb-8" style={{ fontSize: 'var(--t-h1)' }}>
              Свяжитесь с нами
            </h1>
            <p className="text-[var(--c-ink-soft)] font-light text-lg leading-relaxed">
              Мы всегда на связи и готовы помочь с любой проблемой вашей техники.
            </p>
          </div>

          <motion.div
            className="md:col-span-6 md:col-start-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            <div className="divide-y divide-[var(--c-border)]">
              {contacts.map((c, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="py-8 flex gap-6 group"
                >
                  <div className="text-[var(--c-accent)] mt-1 shrink-0">
                    {React.cloneElement(c.icon as React.ReactElement, { className: 'w-5 h-5', strokeWidth: 1.5 })}
                  </div>
                  <div>
                    <p className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-medium mb-2">{c.title}</p>
                    <p className="text-[var(--c-ink)] font-display text-[20px] font-light mb-1">{c.value}</p>
                    <p className="text-[var(--c-ink-soft)] text-[var(--t-small)] font-light">{c.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;