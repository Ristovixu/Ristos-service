import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, MoreHorizontal, User as UserIcon, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type OrderStatus = 'RECEIVED' | 'DIAGNOSTICS' | 'APPROVAL' | 'IN_REPAIR' | 'READY' | 'ISSUED';

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  deviceType: string;
  deviceModel: string | null;
  status: OrderStatus;
  createdAt: string;
  master: { name: string } | null;
  client: { id: string, telegramId: string } | null;
}

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  RECEIVED: { label: 'Принят', color: 'bg-blue-100 text-blue-700' },
  DIAGNOSTICS: { label: 'Диагностика', color: 'bg-purple-100 text-purple-700' },
  APPROVAL: { label: 'Согласование', color: 'bg-amber-100 text-amber-700' },
  IN_REPAIR: { label: 'В ремонте', color: 'bg-indigo-100 text-indigo-700' },
  READY: { label: 'Готов', color: 'bg-emerald-100 text-emerald-700' },
  ISSUED: { label: 'Выдан', color: 'bg-gray-100 text-gray-700' },
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/admin/orders', {
        params: {
          page: currentPage,
          search,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
        }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotal(response.data.total);
        setPages(response.data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [currentPage, statusFilter, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Управление заказами</h1>
          <p className="text-sm text-[#6B7280]">Всего заказов в системе: {total}</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Поиск по номеру, имени или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#C8390B] transition-all text-sm"
          />
        </form>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'RECEIVED', 'DIAGNOSTICS', 'IN_REPAIR', 'READY', 'ISSUED'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
            className={`
              px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all
              ${statusFilter === s 
                ? 'bg-[#C8390B] text-white' 
                : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#C8390B] hover:text-[#C8390B]'}
            `}
          >
            {s === 'ALL' ? 'Все заказы' : statusMap[s as OrderStatus].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">№ Заказа</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Клиент</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Устройство</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Мастер</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Дата</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded"></div></td>
                    ))}
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-[#C8390B]">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111827]">{order.clientName}</span>
                          {order.client?.telegramId && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[9px] font-bold text-blue-600 rounded border border-blue-100">
                              <Send className="w-2.5 h-2.5" /> TG
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#6B7280]">{order.clientPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#111827]">{order.deviceType}</span>
                        <span className="text-xs text-[#6B7280]">{order.deviceModel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMap[order.status].color}`}>
                        {statusMap[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <UserIcon className="w-3 h-3" />
                        </div>
                        {order.master?.name || 'Не назначен'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: ru })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#111827] hover:border-[#C8390B] hover:text-[#C8390B] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-[#6B7280]">Заказов не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#E5E7EB] flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">Страница {currentPage} из {pages}</p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === pages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
