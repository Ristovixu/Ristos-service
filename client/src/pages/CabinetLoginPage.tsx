import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { authStart, authSuccess, authFailure } from '../store/slices/clientAuthSlice';
import { RootState } from '../store';
import { Send, Smartphone, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CabinetLoginPage: React.FC = () => {
  const [method, setMethod] = useState<'telegram' | 'phone' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [botLink, setBotLink] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.clientAuth);

  const startTelegramAuth = async () => {
    dispatch(authStart());
    try {
      const res = await fetch('http://localhost:5000/api/client/auth/request-tg-session', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setBotLink(data.botLink);
        setMethod('telegram');
        setPolling(true);
        dispatch(authFailure('')); // Clear loading spinner
      } else {
        dispatch(authFailure(data.error || 'Ошибка сессии'));
      }
    } catch (err) {
      dispatch(authFailure('Сетевая ошибка'));
    }
  };

  useEffect(() => {
    let interval: any;
    if (polling && sessionId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/client/auth/check-tg-session/${sessionId}`);
          const data = await res.json();
          if (data.success) {
            setPolling(false);
            dispatch(authSuccess({ client: data.client, token: data.token }));
            navigate('/cabinet/orders');
          } else if (data.status === 'EXPIRED') {
            setPolling(false);
            setMethod(null);
            dispatch(authFailure('Сессия истекла. Попробуйте снова.'));
          }
        } catch (e) {
          console.error('Polling error', e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [polling, sessionId, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg)] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--c-surface)] border border-[var(--c-border)] p-10 md:p-14 rounded-[32px] shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--c-accent)]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-12 relative z-10">
          <div className="w-20 h-20 bg-[var(--c-accent)]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[var(--c-accent)]">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-display font-semibold text-[var(--c-ink)] mb-4">Вход для клиентов</h1>
          <p className="text-[var(--c-ink-soft)] font-light leading-relaxed">
            Безопасный доступ к вашим заказам и истории обслуживания
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}

        <div className="space-y-4 relative z-10">
          {!method ? (
            <>
              <Button 
                variant="primary" 
                className="w-full h-16 text-lg rounded-2xl shadow-lg shadow-[var(--c-accent-glow)]"
                onClick={startTelegramAuth}
                isLoading={loading}
              >
                <Send size={20} className="mr-3" /> Войти через Telegram
              </Button>
              
              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-[var(--c-border)] flex-1" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-ink-ghost)]">или</span>
                <div className="h-px bg-[var(--c-border)] flex-1" />
              </div>

              <button 
                onClick={() => navigate('/status')}
                className="w-full py-4 text-[var(--c-ink-soft)] hover:text-[var(--c-ink)] transition-colors text-sm font-medium uppercase tracking-widest"
              >
                Проверить статус без входа
              </button>
            </>
          ) : method === 'telegram' ? (
            <div className="text-center space-y-8 py-4">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[var(--c-accent)]/20 border-t-[var(--c-accent)] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Send size={20} className="text-[var(--c-accent)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-[var(--c-ink)]">Ожидаем подтверждения...</h3>
                  <p className="text-sm text-[var(--c-ink-soft)] px-4">
                    Нажмите кнопку ниже, чтобы открыть бота и нажать <b>«Запустить»</b>
                  </p>
                </div>
              </div>

              <a 
                href={botLink || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="primary" className="w-full h-16 rounded-2xl">
                  Открыть Telegram
                </Button>
              </a>

              <button 
                onClick={() => { setMethod(null); setPolling(false); }}
                className="text-[var(--c-ink-ghost)] hover:text-[var(--c-ink)] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Отмена
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-[var(--c-ink-ghost)] font-light">
            Нажимая «Войти», вы соглашаетесь с <a href="#" className="underline hover:text-[var(--c-ink-soft)]">политикой конфиденциальности</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
