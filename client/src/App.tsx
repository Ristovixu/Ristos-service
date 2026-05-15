import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Client Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import OrderStatusPage from './pages/OrderStatusPage';
import WizardOrderPage from './pages/WizardOrderPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { OrderDetailPage } from './pages/admin/OrderDetailPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminPagesList } from './pages/admin/AdminPagesList';
import { AdminPageEditor } from './pages/admin/AdminPageEditor';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

// Cabinet Pages
import { CabinetLoginPage } from './pages/CabinetLoginPage';
import { CabinetLayout } from './components/CabinetLayout';
import { CabinetOrdersPage } from './pages/CabinetOrdersPage';
import { CabinetDevicesPage } from './pages/CabinetDevicesPage';
import { CabinetNewOrderPage } from './pages/CabinetNewOrderPage';

import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from './components/ui/Button';
import { ChatWidget } from './components/ChatWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'ТехРемонт Pro — Профессиональный сервис вашей техники',
      '/services': 'Услуги и цены — ТехРемонт Pro',
      '/order': 'Оформить заявку — ТехРемонт Pro',
      '/status': 'Проверить статус заказа — ТехРемонт Pro',
      '/admin': 'Вход в панель управления — ТехРемонт Pro',
    };
    document.title = titles[location.pathname] || 'ТехРемонт Pro';
    
    // Скролл вверх при смене страницы
    window.scrollTo(0, 0);
  }, [location]);

  const isAdminOrCabinet = location.pathname.startsWith('/admin') || location.pathname.startsWith('/cabinet');

  return (
    <>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contacts" element={<ContactPage />} />
          <Route path="order" element={<WizardOrderPage />} />
          <Route path="status" element={<OrderStatusPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="content/prices" element={<AdminServicesPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="content/reviews" element={<AdminReviewsPage />} />
          <Route path="content/pages" element={<AdminPagesList />} />
          <Route path="content/pages/:id" element={<AdminPageEditor />} />
          <Route index element={<div className="flex items-center justify-center h-full text-gray-400">Выберите раздел в меню</div>} />
        </Route>

        {/* Cabinet Routes */}
        <Route path="/cabinet/login" element={<CabinetLoginPage />} />
        <Route path="/cabinet" element={<CabinetLayout />}>
          <Route index element={<Navigate to="/cabinet/orders" replace />} />
          <Route path="orders" element={<CabinetOrdersPage />} />
          <Route path="devices" element={<CabinetDevicesPage />} />
          <Route path="order/new" element={<CabinetNewOrderPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-[var(--c-bg)]">
            <h1 className="text-display text-8xl font-bold mb-4 text-[var(--c-ink)]">404</h1>
            <p className="text-xl font-light text-[var(--c-ink-soft)] mb-8 max-w-md">Страница не найдена или находится в ремонте.</p>
            <Link to="/"><Button variant="primary">Вернуться на главную</Button></Link>
          </div>
        } />
      </Routes>
      {!isAdminOrCabinet && <ChatWidget />}
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen w-full bg-[var(--c-bg)]">
          <AppContent />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;