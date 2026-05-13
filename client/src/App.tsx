import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen w-full">
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="contacts" element={<ContactPage />} />
                <Route path="status" element={<OrderStatusPage />} />
                <Route path="order" element={<WizardOrderPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="content/prices" element={<AdminServicesPage />} />
                <Route path="content/reviews" element={<AdminReviewsPage />} />
                <Route path="content/pages" element={<AdminPagesList />} />
                <Route path="content/pages/:slug" element={<AdminPageEditor />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="users" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                } />
                <Route index element={<ProtectedRoute><div className="flex items-center justify-center h-full text-gray-400">Выберите раздел в меню</div></ProtectedRoute>} />
              </Route>
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;