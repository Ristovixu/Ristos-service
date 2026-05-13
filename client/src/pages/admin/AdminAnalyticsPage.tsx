import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, Package, Clock, CheckCircle, 
  Calendar, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import adminApi from '../../api/adminApi';

const COLORS = ['#C8390B', '#2D9CDB', '#D4943A', '#059669'];

const KPICard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#C8390B]">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`flex items-center text-[10px] font-bold ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-[#111827]">{value}</h3>
  </div>
);

export const AdminAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('30');

  const { data: orderStats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats', period],
    queryFn: async () => {
      const res = await adminApi.get('/admin/analytics/orders', { params: { days: period } });
      return res.data;
    }
  });

  const { data: popularRepairs } = useQuery({
    queryKey: ['admin-popular', period],
    queryFn: async () => {
      const res = await adminApi.get('/admin/analytics/popular', { params: { days: period } });
      return res.data.data;
    }
  });

  const { data: trafficData } = useQuery({
    queryKey: ['admin-traffic', period],
    queryFn: async () => {
      const res = await adminApi.get('/admin/analytics/traffic', { params: { days: period } });
      return res.data.data;
    }
  });

  if (loadingStats) return <div className="p-8 text-gray-400">Загрузка аналитики...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Аналитика</h1>
          <p className="text-sm text-[#6B7280]">Показатели эффективности мастерской</p>
        </div>
        <div className="flex bg-white border border-[#E5E7EB] p-1 rounded-xl">
          {[
            { id: '7', label: 'Неделя' },
            { id: '30', label: 'Месяц' },
            { id: '90', label: 'Квартал' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${period === p.id ? 'bg-[#C8390B] text-white shadow-md' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Всего заказов" value={orderStats?.total} icon={Package} trend={12} />
        <KPICard title="Новые" value={orderStats?.new} icon={Calendar} trend={-5} />
        <KPICard title="В работе" value={orderStats?.inProgress} icon={Clock} />
        <KPICard title="Завершено" value={orderStats?.done} icon={CheckCircle} trend={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-8">Заказы по дням</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderStats?.byDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="count" stroke="#C8390B" strokeWidth={3} dot={{ r: 4, fill: '#C8390B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-8">Источники трафика</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count">
                  {trafficData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Repairs */}
        <div className="lg:col-span-12 bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-8">Популярные виды техники</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularRepairs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="deviceType" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600, fill: '#111827'}} width={150} />
                <Tooltip cursor={{fill: '#F9FAFB'}} />
                <Bar dataKey="count" fill="#C8390B" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
