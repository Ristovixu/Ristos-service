import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import adminApi from '../api/adminApi';
import { RootState } from '../store';
import { Lock, User } from 'lucide-react';

const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const AdminLoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || '/admin/orders';

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(loginStart());
    try {
      const response = await adminApi.post('/auth/login', data);
      if (response.data.success) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Не удалось войти';
      dispatch(loginFailure(msg));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E5E7EB] p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-[#111827] mb-2">Вход в админку</h1>
            <p className="text-[#6B7280]">ТехРемонт Pro — Панель управления</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827] ml-1">Логин</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  {...register('login')}
                  className={`
                    w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border rounded-xl outline-none transition-all text-gray-900 font-medium
                    ${errors.login ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#C8390B] focus:bg-white'}
                  `}
                  placeholder="Ваш логин"
                />
              </div>
              {errors.login && <p className="text-red-500 text-xs mt-1 ml-1">{errors.login.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827] ml-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  {...register('password')}
                  type="password"
                  className={`
                    w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border rounded-xl outline-none transition-all text-gray-900 font-medium
                    ${errors.password ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#C8390B] focus:bg-white'}
                  `}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className={`
                w-full py-4 bg-[#C8390B] text-white rounded-xl font-bold tracking-wide
                hover:bg-[#A62F09] transition-all duration-300 shadow-lg shadow-[#C8390B]/20
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Войти в систему'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
