import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Clock, Award, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Motion tokens ── */
const ease = { out: [0.16, 1, 0.3, 1] as const };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }
};

/* ── Parallax hook ── */
const useParallax = (factor = 0.4) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.scrollY * factor}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, [factor]);
  return ref;
};

/* ── Split headline component ── */
const SplitHeadline = ({ text, className = '' }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split(' ').map((word, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: '60%' }}
        whileInView={{ opacity: 1, y: '0%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.08, ease: ease.out }}
        style={{ display: 'inline-block', marginRight: '0.25em', overflow: 'hidden' }}
      >
        {word}
      </motion.span>
    ))}
  </span>
);

/* ── Counter animation ── */
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = performance.now();
        const duration = 1200;
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const HomePage = () => {
  const parallaxRef = useParallax(0.4);
  const [formData, setFormData] = useState({ name: '', phone: '', deviceType: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: formData.deviceType,
          deviceModel: formData.deviceType, // Используем как модель по умолчанию
          problemDesc: 'Быстрая заявка с главной страницы',
          name: formData.name,
          phone: formData.phone,
          deliveryMode: 'SELF_DROPOFF'
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSuccessMsg(`Заявка принята. Номер: ${result.orderNumber}`);
        setFormData({ name: '', phone: '', deviceType: '' });
      }
    } catch (err: any) {
      console.error(err);
      setSuccessMsg(`Ошибка: ${err.message || 'Не удалось отправить заявку'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
    >
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax background image */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ willChange: 'transform' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-bg)] via-[var(--c-bg)]/80 to-[var(--c-bg)]/20 z-10" />
          <img
            src="/images/hero-master.jpg"
            alt="Мастер за работой — крупный план рук, паяльник, плата"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container-grid grid md:grid-cols-12 items-center min-h-screen pt-32 pb-20">
          <div className="md:col-span-7 md:col-start-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.p variants={itemVariants} className="eyebrow mb-6">
                Мастерская по ремонту техники
              </motion.p>

              <h1 className="text-display mb-8" style={{ fontSize: 'var(--t-hero)' }}>
                <SplitHeadline text="Вторая жизнь вашей техники" />
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-[var(--c-ink-soft)] font-light text-lg max-w-lg mb-12 leading-relaxed"
              >
                Профессиональный ремонт смартфонов, ноутбуков и бытовой техники. Бесплатная диагностика и гарантия до 1 года.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link to="/order">
                  <Button variant="primary" withArrow>Оставить заявку</Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary">Услуги и цены</Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[var(--c-ink-ghost)]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="border-y border-[var(--c-border)]">
        <div className="container-grid grid grid-cols-2 md:grid-cols-4">
          {[
            { value: 10000, suffix: '+', label: 'Устройств отремонтировано' },
            { value: 30, suffix: ' мин', label: 'Средний ремонт' },
            { value: 12, suffix: ' мес', label: 'Гарантия' },
            { value: 98, suffix: '%', label: 'Клиентов довольны' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`py-12 md:py-16 text-center ${i < 3 ? 'border-r border-[var(--c-border)]' : ''}`}
            >
              <div className="font-display text-[clamp(32px,4vw,48px)] font-light text-[var(--c-ink)] leading-none mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[var(--c-ink-ghost)] text-[var(--t-small)] font-body uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section className="section-padding">
        <div className="container-grid">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.p variants={itemVariants} className="eyebrow mb-4">Что мы делаем</motion.p>
            <h2 className="text-display" style={{ fontSize: 'var(--t-h1)' }}>
              <SplitHeadline text="Популярные услуги" />
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--c-border)]"
          >
            {[
              { tag: 'Смартфоны', title: 'Ремонт смартфонов', desc: 'Замена экрана, аккумулятора, ремонт материнских плат.', price: 'от 2 500 ₽', img: '/images/service-smartphones.jpg' },
              { tag: 'Ноутбуки', title: 'Ремонт ноутбуков', desc: 'Чистка от пыли, замена матриц, сложный ремонт.', price: 'от 3 000 ₽', img: '/images/service-laptops.jpg' },
              { tag: 'Бытовая техника', title: 'Бытовая техника', desc: 'Телевизоры, микроволновки, пылесосы и другая техника.', price: 'от 2 000 ₽', img: '/images/service-appliances.jpg' },
            ].map((service, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to="/services" className="block bg-[var(--c-surface)] group">
                  <div className="h-[240px] overflow-hidden">
                    <motion.img
                      src={service.img}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                    />
                  </div>
                  <div className="p-8">
                    <p className="eyebrow mb-3">{service.tag}</p>
                    <h3 className="font-display text-[24px] font-light text-[var(--c-ink)] mb-3">{service.title}</h3>
                    <p className="text-[var(--c-ink-soft)] text-[14px] font-light mb-6 leading-relaxed">{service.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--c-ink)] font-body font-medium text-[15px]">{service.price}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--c-ink-ghost)] group-hover:text-[var(--c-accent)] group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ ADVANTAGES ══════ */}
      <section className="section-padding bg-[var(--c-surface)] border-y border-[var(--c-border)]">
        <div className="container-grid">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.p variants={itemVariants} className="eyebrow mb-4">Почему мы</motion.p>
            <h2 className="text-display" style={{ fontSize: 'var(--t-h1)' }}>
              <SplitHeadline text="Мастерство в деталях" />
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {[
              { icon: <ShieldCheck />, title: 'Гарантия до 1 года', desc: 'Предоставляем официальную гарантию на все виды работ и оригинальные запчасти.', num: '01', img: '/images/about-warranty.jpg' },
              { icon: <Clock />, title: 'Ремонт от 30 минут', desc: 'Большинство поломок устраняем в день обращения. Экспресс-ремонт при вас.', num: '02', img: '/images/about-interior.jpg' },
              { icon: <Award />, title: 'Опытные мастера', desc: 'Средний стаж наших инженеров — более 5 лет. Постоянное повышение квалификации.', num: '03', img: '/images/about-team.jpg' },
            ].map((adv, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <div className="h-[200px] overflow-hidden mb-6">
                  <img src={adv.img} alt={adv.title} className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-[72px] font-light text-[var(--c-border)] absolute -top-4 -left-2 select-none leading-none">
                  {adv.num}
                </span>
                <div className="relative pt-12">
                  <div className="mb-6 text-[var(--c-accent)]">
                    {React.cloneElement(adv.icon as React.ReactElement, { className: 'w-6 h-6', strokeWidth: 1.5 })}
                  </div>
                  <h3 className="font-display text-[var(--t-h2)] font-light text-[var(--c-ink)] mb-4">{adv.title}</h3>
                  <p className="text-[var(--c-ink-soft)] font-light text-[15px] leading-relaxed">{adv.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ PROCESS ══════ */}
      <section className="section-padding">
        <div className="container-grid">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.p variants={itemVariants} className="eyebrow mb-4">Как мы работаем</motion.p>
            <h2 className="text-display" style={{ fontSize: 'var(--t-h1)' }}>
              <SplitHeadline text="Путь вашего устройства" />
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--c-border)]"
          >
            {[
              { num: '01', title: 'Приёмка устройства', desc: 'Вы сдаёте устройство — мы фиксируем состояние и проводим бесплатную диагностику.', img: '/images/process-intake.jpg' },
              { num: '02', title: 'Ремонт', desc: 'Мастер выполняет ремонт с использованием профессионального оборудования и оригинальных запчастей.', img: '/images/process-repair.jpg' },
              { num: '03', title: 'Выдача', desc: 'Забирайте готовое устройство с гарантией. Оплата только после проверки.', img: '/images/process-delivery.jpg' },
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-[var(--c-surface)]">
                <div className="h-[240px] overflow-hidden">
                  <motion.img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  />
                </div>
                <div className="p-8">
                  <span className="font-mono text-[var(--c-accent)] text-[var(--t-small)] tracking-wider">{step.num}</span>
                  <h3 className="font-display text-[24px] font-light text-[var(--c-ink)] mt-2 mb-3">{step.title}</h3>
                  <p className="text-[var(--c-ink-soft)] text-[14px] font-light leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ QUICK ORDER FORM ══════ */}
      <section className="section-padding">
        <div className="container-grid">
          <div className="grid md:grid-cols-12 gap-0 border border-[var(--c-border)]">
            <div className="md:col-span-5 p-12 md:p-16 bg-[var(--c-surface-2)] flex flex-col justify-center relative overflow-hidden">
              <p className="text-[var(--c-accent)]/80 font-body text-[var(--t-small)] uppercase tracking-widest mb-6">Быстрая заявка</p>
              <h2 className="font-display text-[var(--t-h1)] font-semibold text-[var(--c-ink)] mb-6 leading-tight">
                Оставьте заявку
              </h2>
              <p className="text-[var(--c-ink-soft)] font-light text-[15px] leading-relaxed">
                Опишите проблему, и мы перезвоним в течение 5 минут для бесплатной консультации.
              </p>
              <div className="absolute inset-0 opacity-10">
                <img src="/images/texture-board.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="md:col-span-7 p-12 md:p-16 bg-[var(--c-surface)]">
              <form className="flex flex-col gap-8" onSubmit={handleQuickOrder}>
                <Input label="Ваше имя" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <Input label="Номер телефона" type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <Input label="Устройство (например, iPhone 15)" required value={formData.deviceType} onChange={(e) => setFormData({...formData, deviceType: e.target.value})} />
                {successMsg && (
                  <div className="py-3 border-l-2 border-[var(--c-status-done)] pl-4 text-[var(--c-status-done)] text-[var(--t-small)]">
                    {successMsg}
                  </div>
                )}
                <Button type="submit" variant="primary" withArrow isLoading={isSubmitting}>
                  Отправить заявку
                </Button>
                <p className="text-[var(--c-ink-ghost)] text-[11px]">
                  Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;