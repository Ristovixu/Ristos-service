import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Check, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setClient } from '../store/slices/clientAuthSlice';

const ease = { out: [0.16, 1, 0.3, 1] as const };

const steps = ['Устройство', 'Проблема', 'Контакты', 'Доставка'];

export const WizardOrderPage = () => {
  const { isAuthenticated, client, token } = useSelector((state: RootState) => state.clientAuth);
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    deviceType: '', deviceModel: '', problemDesc: '',
    name: '', phone: '', messengerType: 'NONE', messengerContact: '', deliveryMode: 'dropoff',
  });

  // Pre-fill data if authenticated
  useEffect(() => {
    if (isAuthenticated && client) {
      const isRealPhone = client.phone && !client.phone.startsWith('TG-');
      setFormData(prev => ({
        ...prev,
        name: client.name || prev.name,
        phone: isRealPhone ? client.phone : prev.phone,
        messengerType: client.telegramId ? 'TELEGRAM' : prev.messengerType,
        messengerContact: client.telegramId || prev.messengerContact
      }));
    }
  }, [isAuthenticated, client]);

  // Polling for real phone if missing
  useEffect(() => {
    let interval: any;
    const hasRealPhone = client?.phone && !client.phone.startsWith('TG-');
    
    if (isAuthenticated && !hasRealPhone) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/client/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await response.json();
          if (result.success && result.client.phone && !result.client.phone.startsWith('TG-')) {
            dispatch(setClient(result.client));
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, client, token, dispatch]);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async () => {
    try {
      const mappedData = {
        ...formData,
        deliveryMode: formData.deliveryMode === 'dropoff' ? 'SELF_DROPOFF' : 'COURIER',
        clientId: client?.id
      };
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(mappedData),
      });
      const result = await response.json();
      if (result.success) {
        setOrderNumber(result.orderNumber);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: ease.out }}
        className="pt-32"
      >
        <div className="container-grid section-padding text-center max-w-xl mx-auto">
          <div className="w-16 h-16 border-2 border-[var(--c-status-done)] flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8 text-[var(--c-status-done)]" />
          </div>
          <h1 className="text-display mb-4" style={{ fontSize: 'var(--t-h1)' }}>Заявка принята</h1>
          <p className="text-[var(--c-ink-soft)] font-light mb-2 text-lg">
            Ваш номер заказа:
          </p>
          <p className="font-mono text-[var(--c-accent)] text-2xl tracking-wider mb-8">{orderNumber}</p>
          <p className="text-[var(--c-ink-soft)] font-light mb-12 leading-relaxed">
            Мы свяжемся с вами в течение 5 минут для уточнения деталей.
          </p>
          <Link to="/status">
            <Button variant="secondary" withArrow>Отследить статус</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[var(--c-accent)]/5 to-transparent -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[300px] bg-[radial-gradient(circle_at_top,var(--c-accent)_0%,transparent_70%)] opacity-[0.03] -z-10" />

      <div className="container-grid pt-40 pb-20 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="eyebrow mb-2">Оформление заявки</p>
            <h1 className="text-display" style={{ fontSize: 'var(--t-h2)' }}>{steps[step]}</h1>
          </motion.div>
          <span className="font-mono text-[var(--c-ink-ghost)] text-[var(--t-mono)]">
            {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
        </div>

        <div className="h-[1px] bg-[var(--c-border)] mb-12 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[var(--c-accent)]"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: ease.out }}
          />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: ease.out }}
          className="space-y-8"
        >
          {step === 0 && (
            <>
              <Input label="Тип устройства" value={formData.deviceType} onChange={(e) => update('deviceType', e.target.value)} required />
              <Input label="Модель устройства" value={formData.deviceModel} onChange={(e) => update('deviceModel', e.target.value)} required />
            </>
          )}
          {step === 1 && (
            <div className="space-y-2">
              <label className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-medium">Описание проблемы</label>
              <textarea
                value={formData.problemDesc}
                onChange={(e) => update('problemDesc', e.target.value)}
                rows={6}
                placeholder="Опишите, что случилось с устройством..."
                className="w-full bg-transparent border-0 border-b border-[var(--c-border)] focus:border-[var(--c-ink)] px-0 py-3 text-[var(--c-ink)] font-body font-light outline-none transition-colors resize-none placeholder:text-[var(--c-ink-ghost)]"
              />
            </div>
          )}
          {step === 2 && (
            <>
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 bg-[var(--c-accent)]/5 border border-[var(--c-accent)]/10 rounded-2xl mb-6">
                  <div className="w-10 h-10 bg-[var(--c-accent)]/10 rounded-xl flex items-center justify-center text-[var(--c-accent)]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--c-accent)]">Подтверждённый аккаунт</p>
                    <p className="text-[11px] text-[var(--c-ink-soft)]">Ваши контакты заполнены автоматически</p>
                  </div>
                </div>
              )}
              <Input label="Ваше имя" value={formData.name} onChange={(e) => update('name', e.target.value)} required />
              <Input label="Телефон" type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} required />
              
              <div className="space-y-4">
                <label className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-bold">Где вам удобнее получать уведомления?</label>
                <div className="flex gap-3">
                  {[
                    { id: 'TELEGRAM', label: 'Telegram' },
                    { id: 'WHATSAPP', label: 'WhatsApp' },
                    { id: 'NONE', label: 'Только звонок' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => update('messengerType', m.id)}
                      className={`px-6 py-3 rounded-xl border transition-all duration-300 font-medium ${
                        formData.messengerType === m.id
                          ? 'bg-[var(--c-accent)] text-white border-[var(--c-accent)]'
                          : 'text-[var(--c-ink-soft)] border-[var(--c-border)] hover:border-[var(--c-border-mid)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                
                {formData.messengerType !== 'NONE' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Input 
                      label={formData.messengerType === 'TELEGRAM' ? 'Ваш @username' : 'Номер WhatsApp'} 
                      value={formData.messengerContact} 
                      onChange={(e) => update('messengerContact', e.target.value)} 
                      required 
                    />
                  </motion.div>
                )}
              </div>
            </>
          )}
          {step === 3 && (
            <div className="space-y-2">
              <label className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-medium">Способ доставки</label>
              <div className="flex flex-col gap-3">
                {[
                  { value: 'dropoff', label: 'Привезу сам', desc: 'Бесплатно' },
                  { value: 'courier', label: 'Вызвать курьера', desc: 'от 500 ₽' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('deliveryMode', opt.value)}
                    className={`text-left px-6 py-5 border transition-all duration-300 ${
                      formData.deliveryMode === opt.value
                        ? 'border-[var(--c-ink)] bg-[var(--c-bg)]'
                        : 'border-[var(--c-border)] hover:border-[var(--c-border-mid)]'
                    }`}
                  >
                    <div className="font-body font-medium text-[var(--c-ink)]">{opt.label}</div>
                    <div className="text-[var(--c-ink-soft)] text-[var(--t-small)] mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-between mt-16 pt-8 border-t border-[var(--c-border)]">
          {step > 0 ? (
            <Button variant="ghost" onClick={prevStep}>← Назад</Button>
          ) : <div />}
          {step < steps.length - 1 ? (
            <Button variant="primary" withArrow onClick={nextStep}>Далее</Button>
          ) : (
            <Button variant="primary" withArrow onClick={onSubmit}>Отправить заявку</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WizardOrderPage;
