import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ease = { out: [0.16, 1, 0.3, 1] as const };

export const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch { setError('Ошибка соединения с сервером'); }
    finally { setIsLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
      className="min-h-[80vh] flex items-center justify-center px-4 pt-32"
    >
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <span className="font-display text-[28px] font-semibold text-[var(--c-ink)]">TechRepair</span>
          <p className="text-[var(--c-ink-soft)] font-light mt-2">Панель управления</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <Input label="Логин" value={username} onChange={e => setUsername(e.target.value)} required />
          <Input label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-[var(--c-accent)] text-[var(--t-small)] text-center">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>Войти</Button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLoginPage;
