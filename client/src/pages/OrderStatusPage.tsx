import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const ease = { out: [0.16, 1, 0.3, 1] as const };
type Status = 'RECEIVED' | 'DIAGNOSTICS' | 'APPROVAL' | 'IN_REPAIR' | 'READY' | 'ISSUED' | 'CANCELLED';
const statusSteps: { key: string; label: string; matches: Status[] }[] = [
  { key: 'RECEIVED', label: 'Принят', matches: ['RECEIVED'] },
  { key: 'REPAIR', label: 'В ремонте', matches: ['DIAGNOSTICS', 'APPROVAL', 'IN_REPAIR'] },
  { key: 'READY', label: 'Готов', matches: ['READY'] },
  { key: 'DONE', label: 'Выдан', matches: ['ISSUED'] },
];

export const OrderStatusPage = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [currentStatus, setCurrentStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/status?orderNumber=${orderId.trim()}&phone=${phone.trim()}`);
      const result = await res.json();
      if (result.success && result.order) {
        setOrderData(result.order);
        setCurrentStatus(result.order.status as Status);
      } else {
        setError(result.error || 'Заказ не найден. Проверьте номер и телефон.');
      }
    } catch { setError('Ошибка соединения с сервером'); }
    finally { setIsLoading(false); }
  };

  const getActiveStepIdx = () => {
    if (!currentStatus) return -1;
    return statusSteps.findIndex(s => s.matches.includes(currentStatus));
  };

  const idx = getActiveStepIdx();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: ease.out }} className="pt-32">
      <div className="container-grid section-padding max-w-2xl mx-auto">
        <div className="mb-16">
          <p className="eyebrow mb-4">Отслеживание</p>
          <h1 className="text-display mb-6 font-semibold" style={{ fontSize: 'var(--t-h1)' }}>Статус заказа</h1>
        </div>

        {!currentStatus ? (
          <form onSubmit={handleSearch} className="space-y-8">
            <Input label="Номер заказа (TR-XXXXX)" value={orderId} onChange={e => setOrderId(e.target.value)} required />
            <Input label="Номер телефона" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            {error && <p className="text-[var(--c-accent)] text-[var(--t-small)]">{error}</p>}
            <Button type="submit" variant="primary" withArrow isLoading={isLoading}>Проверить</Button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-12 pb-8 border-b border-[var(--c-border)]">
              <div>
                <p className="font-mono text-[var(--c-accent)] tracking-wider mb-1">{orderData?.orderNumber}</p>
                <p className="text-[var(--c-ink-soft)] text-[var(--t-small)]">{orderData?.deviceModel}</p>
              </div>
              <Button variant="ghost" onClick={() => { setCurrentStatus(null); setOrderData(null); }}>Новый поиск</Button>
            </div>

            <div className="relative mb-12">
              <div className="absolute top-3 left-3 right-3 h-[2px] bg-[var(--c-border)]">
                <motion.div className="h-full bg-[var(--c-accent)]" initial={{ width: '0%' }} animate={{ width: `${(idx / (statusSteps.length - 1)) * 100}%` }} transition={{ duration: 0.8, ease: ease.out }} />
              </div>
              <div className="relative flex justify-between">
                {statusSteps.map((s, i) => (
                  <div key={s.key} className="flex flex-col items-center" style={{ width: `${100 / statusSteps.length}%` }}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${i <= idx ? 'bg-[var(--c-accent)] border-[var(--c-accent)] shadow-[0_0_15px_var(--c-accent-glow)]' : 'bg-[var(--c-bg)] border-[var(--c-border-mid)]'} ${i === idx ? 'ring-4 ring-[var(--c-accent)]/20' : ''}`}>
                      {i <= idx && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <p className={`mt-4 text-center font-body font-medium uppercase tracking-widest ${i <= idx ? 'text-[var(--c-ink)]' : 'text-[var(--c-ink-ghost)]'}`} style={{ fontSize: 'var(--t-small)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {orderData?.internalNote && (
              <div className="border-l-2 border-[var(--c-accent)] pl-6 py-2">
                <p className="eyebrow mb-2">Комментарий мастера</p>
                <p className="text-[var(--c-ink-soft)] font-light">{orderData.internalNote}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default OrderStatusPage;
