import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Smartphone, Plus, Check, Laptop, Tv, HardDrive } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ease = { out: [0.16, 1, 0.3, 1] as const };
const steps = ['Выбор устройства', 'Проблема', 'Доставка'];

interface Device {
  id: string;
  type: string;
  model: string | null;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone size={20} />,
  laptop: <Laptop size={20} />,
  tv: <Tv size={20} />,
  default: <HardDrive size={20} />
};

export const CabinetNewOrderPage: React.FC = () => {
  const location = useLocation();
  const { client } = useSelector((state: RootState) => state.clientAuth);
  const [step, setStep] = useState(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | 'new'>('new');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deviceType: '', deviceModel: '', problemDesc: '',
    deliveryMode: 'dropoff',
  });

  useEffect(() => {
    // Check for pre-filled data from "Repeat Order"
    if (location.state && location.state.deviceType) {
      setFormData(prev => ({
        ...prev,
        deviceType: location.state.deviceType,
        deviceModel: location.state.deviceModel || ''
      }));
      setStep(1); // Jump to problem description
    }
  }, [location.state]);

  useEffect(() => {
    fetch('http://localhost:5000/api/client/cabinet/devices', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('client_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setDevices(data.devices);
      });
  }, []);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleDeviceSelect = (device: Device | 'new') => {
    if (device === 'new') {
      setSelectedDeviceId('new');
      setFormData({ ...formData, deviceType: '', deviceModel: '' });
    } else {
      setSelectedDeviceId(device.id);
      setFormData({ ...formData, deviceType: device.type, deviceModel: device.model || '' });
    }
    setStep(1);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('client_token')}`
        },
        body: JSON.stringify({
          ...formData,
          name: client?.phone, // Use phone as name for cabinet orders
          phone: client?.phone,
          deliveryMode: formData.deliveryMode === 'dropoff' ? 'SELF_DROPOFF' : 'COURIER',
          messengerType: client?.telegramId ? 'TELEGRAM' : 'NONE',
          messengerContact: client?.telegramId || ''
        }),
      });
      const result = await response.json();
      if (result.success) {
        setOrderNumber(result.orderNumber);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-2 border-[var(--c-status-done)] flex items-center justify-center mx-auto mb-8 rounded-2xl">
          <Check className="w-8 h-8 text-[var(--c-status-done)]" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-[var(--c-ink)] mb-4">Заявка успешно создана</h1>
        <p className="text-[var(--c-ink-soft)] mb-8">Номер вашего заказа: <span className="font-mono text-[var(--c-accent)] font-bold">{orderNumber}</span></p>
        <Link to="/cabinet/orders">
          <Button variant="primary">Перейти к списку заказов</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">Новая заявка</p>
          <span className="font-mono text-[var(--c-ink-ghost)] text-xs">
            {step + 1} / {steps.length}
          </span>
        </div>
        <h1 className="text-4xl font-display font-semibold text-[var(--c-ink)]">{steps[step]}</h1>
      </header>

      {/* Progress */}
      <div className="h-px bg-[var(--c-border)] mb-12 relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-[var(--c-accent)]"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map(device => (
              <button
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className="p-6 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl text-left hover:border-[var(--c-accent)] transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[var(--c-surface-2)] rounded-lg flex items-center justify-center text-[var(--c-accent)]">
                  {TYPE_ICONS[device.type.toLowerCase()] || TYPE_ICONS.default}
                </div>
                <div>
                  <div className="text-[var(--c-ink)] font-medium">{device.model || device.type}</div>
                  <div className="text-[var(--c-ink-ghost)] text-xs uppercase tracking-widest">{device.type}</div>
                </div>
              </button>
            ))}
            <button
              onClick={() => handleDeviceSelect('new')}
              className="p-6 bg-[var(--c-surface-2)] border border-dashed border-[var(--c-border)] rounded-2xl text-left hover:border-[var(--c-ink-soft)] transition-all flex items-center gap-4 group"
            >
              <div className="w-10 h-10 border border-dashed border-[var(--c-border)] rounded-lg flex items-center justify-center text-[var(--c-ink-ghost)] group-hover:text-[var(--c-ink-soft)] transition-colors">
                <Plus size={20} />
              </div>
              <div className="text-[var(--c-ink-soft)] font-medium">Новое устройство</div>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Тип" value={formData.deviceType} onChange={(e) => update('deviceType', e.target.value)} required />
              <Input label="Модель" value={formData.deviceModel} onChange={(e) => update('deviceModel', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-bold">Описание проблемы</label>
              <textarea
                value={formData.problemDesc}
                onChange={(e) => update('problemDesc', e.target.value)}
                rows={5}
                className="w-full bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-xl p-4 text-[var(--c-ink)] font-body outline-none focus:border-[var(--c-accent)] transition-colors"
                placeholder="Что случилось?"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setStep(2)}>Далее</Button>
              <Button variant="secondary" onClick={() => setStep(0)}>Назад</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              {[
                { value: 'dropoff', label: 'Привезу сам', desc: 'Бесплатно в наш сервис' },
                { value: 'courier', label: 'Вызвать курьера', desc: 'Заберем в удобное время' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('deliveryMode', opt.value)}
                  className={`w-full p-6 border rounded-2xl text-left transition-all ${
                    formData.deliveryMode === opt.value 
                      ? 'bg-[var(--c-accent)]/10 border-[var(--c-accent)]' 
                      : 'bg-[var(--c-surface-2)] border-[var(--c-border)]'
                  }`}
                >
                  <div className="text-[var(--c-ink)] font-medium">{opt.label}</div>
                  <div className="text-[var(--c-ink-ghost)] text-xs">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={onSubmit} isLoading={loading}>Отправить заявку</Button>
              <Button variant="secondary" onClick={() => setStep(1)}>Назад</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
