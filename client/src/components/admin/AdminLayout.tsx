import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, MessageSquare, Tag, BarChart3 } from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import adminApi from '../../api/adminApi';

const navItems = [
  { name: 'Заказы', path: '/admin/orders', icon: ShoppingCart, roles: ['ADMIN', 'MANAGER', 'MASTER'] },
  { name: 'Услуги', path: '/admin/content/prices', icon: Tag, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Отзывы', path: '/admin/content/reviews', icon: MessageSquare, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Страницы', path: '/admin/content/pages', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Аналитика', path: '/admin/analytics', icon: BarChart3, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Пользователи', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
];

export const AdminLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminApi.post('/auth/logout');
      dispatch(logout());
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#111827]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#E5E7EB] flex flex-col fixed h-screen z-30">
        <div className="h-20 flex items-center px-6 border-b border-[#E5E7EB]">
          <span className="font-display text-xl font-bold text-[#C8390B] tracking-tight">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                ${isActive 
                  ? 'bg-[#C8390B]/5 text-[#C8390B]' 
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#C8390B] flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-[#6B7280] truncate uppercase">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] p-8">
        <Outlet />
      </main>
    </div>
  );
};
