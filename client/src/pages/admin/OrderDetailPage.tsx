import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Plus, Trash2, Send, 
  Clock, User, Phone, Smartphone, MapPin, CheckCircle2 
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type OrderStatus = 'RECEIVED' | 'DIAGNOSTICS' | 'APPROVAL' | 'IN_REPAIR' | 'READY' | 'ISSUED';
const steps: OrderStatus[] = ['RECEIVED', 'DIAGNOSTICS', 'APPROVAL', 'IN_REPAIR', 'READY', 'ISSUED'];

const statusLabels: Record<OrderStatus, string> = {
  RECEIVED: 'Принят',
  DIAGNOSTICS: 'Диагностика',
  APPROVAL: 'Согласование',
  IN_REPAIR: 'В ремонте',
  READY: 'Готов',
  ISSUED: 'Выдан',
};

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'INTERNAL' | 'PUBLIC'>('INTERNAL');

  // Формы редактирования
  const [clientData, setClientData] = useState({ clientName: '', clientPhone: '' });
  const [isClientModified, setIsClientModified] = useState(false);

  const [staff, setStaff] = useState<any[]>([]);

  const fetchOrder = async () => {
    try {
      const response = await adminApi.get(`/admin/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
        setClientData({ 
          clientName: response.data.order.clientName, 
          clientPhone: response.data.order.clientPhone 
        });
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await adminApi.get('/admin/users/staff');
      if (res.data.success) setStaff(res.data.staff);
    } catch (err) { console.error('Failed to fetch staff'); }
  };

  useEffect(() => {
    fetchOrder();
    fetchStaff();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await adminApi.patch(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrder();
    } catch (error) {
      alert('Ошибка при смене статуса');
    }
  };

  const handleMasterChange = async (masterId: string) => {
    try {
      // Используем роут админки для обновления заказа
      await adminApi.patch(`/admin/orders/${id}/status`, { masterId }); 
      fetchOrder();
    } catch (error) {
      console.error('Master change error:', error);
      alert('Ошибка при назначении мастера');
    }
  };

  const handleClientSave = async () => {
    try {
      await adminApi.patch(`/admin/orders/${id}/client`, clientData);
      setIsClientModified(false);
      fetchOrder();
    } catch (error) {
      alert('Ошибка при сохранении данных клиента');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await adminApi.post(`/admin/orders/${id}/notes`, { text: noteText, type: noteType });
      setNoteText('');
      fetchOrder();
    } catch (error) {
      alert('Ошибка при добавлении заметки');
    }
  };

  if (loading) return <div className="p-8 text-[#6B7280]">Загрузка заказа...</div>;
  if (!order) return <div className="p-8 text-[#6B7280]">Заказ не найден</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E5E7EB]">
          <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Заказ {order.orderNumber}</h1>
          <p className="text-sm text-[#6B7280]">Создан {format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Status Stepper */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280] mb-8">Статус заказа</h2>
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-100 -z-0">
                <div 
                  className="h-full bg-[#C8390B] transition-all duration-500" 
                  style={{ width: `${(steps.indexOf(order.status) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, idx) => {
                const isActive = step === order.status;
                const isCompleted = steps.indexOf(step) < steps.indexOf(order.status);
                return (
                  <button
                    key={step}
                    onClick={() => handleStatusChange(step)}
                    className="relative flex flex-col items-center group z-10"
                  >
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${isActive ? 'bg-[#C8390B] border-[#C8390B] shadow-lg shadow-[#C8390B]/20' : 
                        isCompleted ? 'bg-[#C8390B] border-[#C8390B]' : 'bg-white border-gray-200'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                       isActive ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : 
                       <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                    </div>
                    <span className={`mt-3 text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-[#C8390B]' : 'text-[#9CA3AF]'}`}>
                      {statusLabels[step]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280]">Данные клиента</h2>
              {isClientModified && (
                <button onClick={handleClientSave} className="flex items-center gap-2 text-xs font-bold text-[#C8390B] hover:opacity-80">
                  <Save className="w-4 h-4" /> Сохранить
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Имя клиента</label>
                <div className="flex items-center gap-2">
                  <input 
                    value={clientData.clientName}
                    onChange={e => { setClientData({...clientData, clientName: e.target.value}); setIsClientModified(true); }}
                    className="flex-1 text-sm font-medium border-b border-transparent focus:border-[#C8390B] outline-none py-1 transition-all"
                  />
                  {order.client && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-[10px] font-bold text-green-600 rounded-lg border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> Рег.
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Телефон</label>
                <div className="flex items-center gap-2">
                  <input 
                    value={clientData.clientPhone}
                    onChange={e => { setClientData({...clientData, clientPhone: e.target.value}); setIsClientModified(true); }}
                    className="flex-1 text-sm font-medium border-b border-transparent focus:border-[#C8390B] outline-none py-1 transition-all"
                  />
                  {order.client?.telegramId && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-lg border border-blue-100" title="Клиент подключен к Telegram">
                      <Send className="w-3 h-3" /> TG
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-[10px] text-[#9CA3AF] uppercase mb-1">Устройство</p><p className="text-sm font-medium">{order.deviceType}</p></div>
              <div><p className="text-[10px] text-[#9CA3AF] uppercase mb-1">Модель</p><p className="text-sm font-medium">{order.deviceModel || '—'}</p></div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase mb-1">Доставка</p>
                <p className="text-sm font-medium">{order.deliveryMode}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase mb-1">Мастер</p>
                <select 
                  value={order.masterId || ''}
                  onChange={e => handleMasterChange(e.target.value)}
                  className="text-sm font-medium text-[#C8390B] bg-transparent outline-none cursor-pointer border-b border-transparent hover:border-[#C8390B]/30"
                >
                  <option value="">Не назначен</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Estimate Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280]">Смета (Работы и запчасти)</h2>
              <button 
                onClick={() => {
                  const newItems = [...(order.estimate || []), { name: '', type: 'WORK', qty: 1, price: 0 }];
                  setOrder({ ...order, estimate: newItems });
                }}
                className="flex items-center gap-2 text-xs font-bold text-[#C8390B] hover:opacity-80"
              >
                <Plus className="w-4 h-4" /> Добавить строку
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[10px] uppercase font-bold text-[#9CA3AF]">Наименование</th>
                    <th className="pb-4 text-[10px] uppercase font-bold text-[#9CA3AF]">Тип</th>
                    <th className="pb-4 text-[10px] uppercase font-bold text-[#9CA3AF]">Кол-во</th>
                    <th className="pb-4 text-[10px] uppercase font-bold text-[#9CA3AF]">Цена</th>
                    <th className="pb-4 text-[10px] uppercase font-bold text-[#9CA3AF] text-right">Сумма</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.estimate?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-4">
                        <input 
                          value={item.name}
                          onChange={e => {
                            const newItems = [...order.estimate];
                            newItems[idx].name = e.target.value;
                            setOrder({ ...order, estimate: newItems });
                          }}
                          placeholder="Замена экрана..."
                          className="w-full text-sm outline-none bg-transparent"
                        />
                      </td>
                      <td className="py-4">
                        <select 
                          value={item.type}
                          onChange={e => {
                            const newItems = [...order.estimate];
                            newItems[idx].type = e.target.value;
                            setOrder({ ...order, estimate: newItems });
                          }}
                          className="text-xs font-medium outline-none bg-transparent"
                        >
                          <option value="WORK">Работа</option>
                          <option value="PART">Запчасть</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <input 
                          type="number"
                          value={item.qty}
                          onChange={e => {
                            const newItems = [...order.estimate];
                            newItems[idx].qty = Number(e.target.value);
                            setOrder({ ...order, estimate: newItems });
                          }}
                          className="w-12 text-sm outline-none bg-transparent"
                        />
                      </td>
                      <td className="py-4">
                        <input 
                          type="number"
                          value={item.price}
                          onChange={e => {
                            const newItems = [...order.estimate];
                            newItems[idx].price = Number(e.target.value);
                            setOrder({ ...order, estimate: newItems });
                          }}
                          className="w-20 text-sm outline-none bg-transparent"
                        />
                      </td>
                      <td className="py-4 text-sm font-medium text-right">
                        {(item.qty * item.price).toLocaleString()} ₽
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => {
                            const newItems = order.estimate.filter((_: any, i: number) => i !== idx);
                            setOrder({ ...order, estimate: newItems });
                          }}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm font-bold text-[#111827]">
                Итого: {order.estimate?.reduce((acc: number, item: any) => acc + (item.qty * item.price), 0).toLocaleString()} ₽
              </div>
              <button 
                onClick={async () => {
                  try {
                    await adminApi.put(`/admin/orders/${id}/estimate`, { items: order.estimate });
                    alert('Смета сохранена');
                  } catch (error) { alert('Ошибка сохранения'); }
                }}
                className="px-6 py-2 bg-[#111827] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
              >
                Сохранить смету
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Notes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col h-[600px] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280]">Активность и заметки</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {order.notes.map((note: any) => (
                <div key={note.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${note.type === 'INTERNAL' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {note.type === 'INTERNAL' ? 'ВНУТРЕННЯЯ' : 'ПУБЛИЧНАЯ'}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">{format(new Date(note.createdAt), 'HH:mm, dd MMM', { locale: ru })}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] shadow-sm">
                    <p className="text-sm text-[#111827] leading-relaxed">{note.text}</p>
                    <p className="mt-2 text-[10px] text-[#6B7280] font-medium flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> {note.author.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="p-4 border-t border-[#E5E7EB] bg-white">
              <textarea 
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Напишите заметку..."
                className="w-full h-24 p-3 text-sm bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-[#C8390B] transition-all resize-none border-none"
              />
              <div className="flex items-center justify-between mt-3">
                <select 
                  value={noteType}
                  onChange={e => setNoteType(e.target.value as any)}
                  className="text-xs font-bold text-[#6B7280] bg-transparent outline-none cursor-pointer"
                >
                  <option value="INTERNAL">Внутренняя</option>
                  <option value="PUBLIC">Для клиента</option>
                </select>
                <button type="submit" className="p-2 bg-[#C8390B] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
