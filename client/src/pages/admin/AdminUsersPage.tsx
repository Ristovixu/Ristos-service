import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Trash2, Key, User as UserIcon, Mail } from 'lucide-react';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface User {
  id: string;
  login: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'MASTER';
  createdAt: string;
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ login: '', name: '', password: '', role: 'MANAGER' });

  const fetchUsers = async () => {
    try {
      const response = await adminApi.get('/admin/users');
      if (response.data.success) setUsers(response.data.users);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.post('/admin/users', formData);
      setIsModalOpen(false);
      setFormData({ login: '', name: '', password: '', role: 'MANAGER' });
      fetchUsers();
    } catch (error: any) { alert(error.response?.data?.error || 'Ошибка'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить сотрудника?')) return;
    try {
      await adminApi.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error: any) { alert(error.response?.data?.error || 'Ошибка'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Управление персоналом</h1>
          <p className="text-sm text-[#6B7280]">Доступ в систему и уровни прав</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111827] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Добавить сотрудника
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-400">Загрузка...</div>
        ) : users.map(user => (
          <div key={user.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {user.role}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg mb-1">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user.login}
            </p>

            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
                С нами с {format(new Date(user.createdAt), 'MMM yyyy', { locale: ru })}
              </span>
              <button 
                onClick={() => handleDelete(user.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleAdd}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6">Новый сотрудник</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">ФИО Сотрудника</label>
                <input required placeholder="Иванов Иван" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Логин</label>
                <input required placeholder="ivanov_repair" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Пароль</label>
                <input required type="password" placeholder="••••••••" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Роль</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="MANAGER">Менеджер</option>
                  <option value="MASTER">Мастер</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50">Отмена</button>
              <button type="submit" className="flex-1 py-3 bg-[#C8390B] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#C8390B]/20 hover:bg-[#A62F09]">Добавить</button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
};
