import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  PlusCircle, 
  ChevronDown,
  MessageSquare,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  orderNumber: string;
  deviceType: string;
  deviceModel: string | null;
  status: string;
  createdAt: string;
  estimate: any[];
  notes: any[];
}

const STATUS_LABELS: Record<string, { label: string, color: string }> = {
  RECEIVED:    { label: 'Принят', color: 'bg-slate-500' },
  DIAGNOSTICS: { label: 'Диагностика', color: 'bg-blue-500' },
  APPROVAL:    { label: 'Согласование', color: 'bg-amber-500' },
  IN_REPAIR:   { label: 'В ремонте', color: 'bg-indigo-500' },
  READY:       { label: 'Готов', color: 'bg-green-500' },
  ISSUED:      { label: 'Выдан', color: 'bg-gray-700' },
};

export const CabinetOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/client/cabinet/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('client_token')}` } // Fallback if cookie not sent
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-[var(--c-surface)] rounded-xl" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-[var(--c-surface)] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-display font-semibold text-[var(--c-ink)] mb-4">История заказов</h1>
        <p className="text-[var(--c-ink-soft)] font-light">Здесь отображаются все ваши обращения в нашу мастерскую.</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[var(--c-surface)] rounded-3xl border border-dashed border-[var(--c-border)]">
          <Package className="mx-auto mb-6 text-[var(--c-ink-ghost)]" size={48} />
          <h3 className="text-xl font-display font-medium text-[var(--c-ink)] mb-2">Заказов пока нет</h3>
          <p className="text-[var(--c-ink-soft)] font-light">Как только вы оставите заявку, она появится здесь.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--c-border-mid)]"
            >
              <div 
                className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${STATUS_LABELS[order.status]?.color || 'bg-gray-500'} shadow-[0_0_10px_rgba(0,0,0,0.2)]`} />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[var(--c-accent)] text-sm font-medium tracking-tighter">#{order.orderNumber}</span>
                      <span className="text-[var(--c-ink-ghost)] text-xs">•</span>
                      <span className="text-[var(--c-ink-ghost)] text-xs uppercase tracking-widest font-medium">
                        {format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ru })}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-medium text-[var(--c-ink)]">
                      {order.deviceType} {order.deviceModel}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="px-4 py-1.5 rounded-full bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                    <span className="text-xs font-medium uppercase tracking-widest text-[var(--c-ink)]">
                      {STATUS_LABELS[order.status]?.label || order.status}
                    </span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-[var(--c-ink-ghost)] transition-transform duration-300 ${expandedId === order.id ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--c-border)] bg-[var(--c-bg)]/50"
                  >
                    <div className="p-8 space-y-8">
                      {/* Смета */}
                      <div className="grid md:grid-cols-2 gap-12">
                        <div>
                          <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--c-ink-ghost)] mb-6">
                            <CreditCard size={14} /> Состав работ и запчастей
                          </h4>
                          {order.estimate.length > 0 ? (
                            <div className="space-y-3">
                              {order.estimate.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="text-[var(--c-ink-soft)]">{item.name}</span>
                                  <span className="text-[var(--c-ink)] font-mono font-medium">{item.price.toLocaleString()} ₽</span>
                                </div>
                              ))}
                              <div className="pt-4 border-t border-[var(--c-border)] flex justify-between items-center">
                                <span className="font-display font-semibold text-[var(--c-ink)]">Итого</span>
                                <span className="text-xl font-mono font-bold text-[var(--c-accent)]">
                                  {order.estimate.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()} ₽
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-[var(--c-ink-ghost)] italic">Смета еще не сформирована</p>
                          )}
                        </div>

                        {/* Комментарии */}
                        <div>
                          <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--c-ink-ghost)] mb-6">
                            <MessageSquare size={14} /> Сообщения от мастера
                          </h4>
                          <div className="space-y-4">
                            {order.notes.length > 0 ? order.notes.map((note: any, idx: number) => (
                              <div key={idx} className="p-4 bg-[var(--c-surface)] rounded-xl border border-[var(--c-border)]">
                                <p className="text-sm text-[var(--c-ink-soft)] leading-relaxed mb-2">{note.text}</p>
                                <span className="text-[10px] uppercase tracking-widest text-[var(--c-ink-ghost)]">
                                  {format(new Date(note.createdAt), 'HH:mm, d MMM', { locale: ru })}
                                </span>
                              </div>
                            )) : (
                              <p className="text-sm text-[var(--c-ink-ghost)] italic">Пока нет публичных комментариев</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Кнопка повтора */}
                      <div className="pt-8 border-t border-[var(--c-border)] flex justify-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/cabinet/order/new', { 
                              state: { 
                                deviceType: order.deviceType, 
                                deviceModel: order.deviceModel 
                              } 
                            });
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-xl text-sm font-medium text-[var(--c-ink)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-all"
                        >
                          <PlusCircle size={16} />
                          Повторить этот заказ
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
