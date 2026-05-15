import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/clientAuthSlice';
import { 
  Package, 
  Smartphone, 
  PlusCircle, 
  LogOut, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CabinetLayout: React.FC = () => {
  const { isAuthenticated, client } = useSelector((state: RootState) => state.clientAuth);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Navigate to="/cabinet/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { to: '/', icon: <PlusCircle size={20} className="rotate-45" />, label: 'Вернуться на сайт' },
    { to: '/cabinet/orders', icon: <Package size={20} />, label: 'Мои заказы' },
    { to: '/cabinet/devices', icon: <Smartphone size={20} />, label: 'Мои устройства' },
    { to: '/cabinet/order/new', icon: <PlusCircle size={20} />, label: 'Новая заявка' },
  ];

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-[var(--c-surface)] border-r border-[var(--c-border)] flex flex-col">
        <div className="p-8 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--c-accent)] flex items-center justify-center text-white font-display font-bold text-xl">
              {client?.phone.slice(-2)}
            </div>
            <div>
              <p className="text-[var(--c-ink)] font-medium">{client?.phone}</p>
              <p className="text-[var(--c-ink-ghost)] text-xs uppercase tracking-widest mt-1">Клиент</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between p-4 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-[var(--c-accent)] text-white shadow-lg shadow-[var(--c-accent-glow)]' 
                  : 'text-[var(--c-ink-soft)] hover:bg-[var(--c-surface-2)] hover:text-[var(--c-ink)]'}
              `}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-body font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className={`transition-transform duration-300 ${item.to === window.location.pathname ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-[var(--c-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Выйти из кабинета</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <Outlet />
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--c-surface)] border-t border-[var(--c-border)] px-6 py-4 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1
              ${isActive ? 'text-[var(--c-accent)]' : 'text-[var(--c-ink-ghost)]'}
            `}
          >
            {item.icon}
            <span className="text-[10px] uppercase tracking-tighter font-medium">
              {item.to === '/' ? 'Сайт' : (item.label.split(' ')[1] || item.label)}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
