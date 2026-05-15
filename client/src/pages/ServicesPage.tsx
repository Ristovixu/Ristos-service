import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

const ease = { out: [0.16, 1, 0.3, 1] as const };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }
};

const services = [
  { category: 'Смартфоны', name: 'Замена дисплея', time: 'от 40 мин', price: 'от 3 500 ₽', img: '/images/service-smartphones.jpg' },
  { category: 'Смартфоны', name: 'Замена аккумулятора', time: 'от 20 мин', price: 'от 2 500 ₽', img: '/images/service-smartphones.jpg' },
  { category: 'Смартфоны', name: 'Ремонт материнской платы', time: 'от 2 часов', price: 'от 5 000 ₽', img: '/images/service-diagnostics.jpg' },
  { category: 'Ноутбуки', name: 'Чистка от пыли', time: 'от 30 мин', price: 'от 2 000 ₽', img: '/images/service-laptops.jpg' },
  { category: 'Ноутбуки', name: 'Замена матрицы', time: 'от 1 часа', price: 'от 4 500 ₽', img: '/images/service-laptops.jpg' },
  { category: 'Ноутбуки', name: 'Замена клавиатуры', time: 'от 40 мин', price: 'от 3 000 ₽', img: '/images/service-laptops.jpg' },
  { category: 'Бытовая техника', name: 'Ремонт телевизоров', time: 'от 1 часа', price: 'от 3 000 ₽', img: '/images/service-appliances.jpg' },
  { category: 'Бытовая техника', name: 'Ремонт микроволновок', time: 'от 40 мин', price: 'от 2 000 ₽', img: '/images/service-appliances.jpg' },
];

const categories = ['Все', ...Array.from(new Set(services.map(s => s.category)))];

export const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = services.filter(s => {
    const matchCategory = activeCategory === 'Все' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
        {/* Header */}
        <div className="mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-4"
          >
            Каталог
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-display mb-8" 
            style={{ fontSize: 'var(--t-h1)' }}
          >
            Услуги и цены
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--c-ink-soft)] font-light text-lg max-w-xl leading-relaxed"
          >
            Мы чиним практически любую технику. Все цены — ориентировочные, точная стоимость определяется после диагностики.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-8 border-b border-[var(--c-border)]">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-body text-[14px] transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-[var(--c-accent)] text-white border-[var(--c-accent)] shadow-[0_0_15px_var(--c-accent-glow)]'
                    : 'bg-transparent text-[var(--c-ink-soft)] border-[var(--c-border)] hover:border-[var(--c-border-mid)] hover:text-[var(--c-ink)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-ink-ghost)]" />
            <input
              type="text"
              placeholder="Поиск услуги..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pb-2 bg-transparent border-0 border-b border-[var(--c-border)] text-[var(--c-ink)] font-body font-light text-[15px] outline-none focus:border-[var(--c-accent)] transition-colors placeholder:text-[var(--c-ink-ghost)]"
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--c-border)]"
        >
          {filtered.map((service, i) => (
            <motion.div key={`${service.name}-${i}`} variants={itemVariants} className="bg-[var(--c-surface)] group">
              <div className="h-[200px] overflow-hidden">
                <motion.img
                  src={service.img}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                />
              </div>
              <div className="p-6">
                <p className="eyebrow text-[11px] mb-2">{service.category}</p>
                <h3 className="font-display text-[22px] font-semibold text-[var(--c-ink)] mb-2">{service.name}</h3>
                <p className="text-[var(--c-ink-ghost)] text-[var(--t-small)] mb-4">{service.time}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--c-ink)] font-body font-medium">{service.price}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--c-ink-ghost)] group-hover:text-[var(--c-accent)] group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServicesPage;
