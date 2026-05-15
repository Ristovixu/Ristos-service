import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Laptop, Tv, Speaker, Plus, Trash2, Calendar, HardDrive } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Device {
  id: string;
  type: string;
  model: string | null;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone />,
  laptop: <Laptop />,
  tv: <Tv />,
  audio: <Speaker />,
  default: <HardDrive />
};

export const CabinetDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ type: 'smartphone', model: '' });

  const fetchDevices = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/client/cabinet/devices', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('client_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setDevices(data.devices);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/client/cabinet/devices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('client_token')}`
        },
        body: JSON.stringify(newDevice),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewDevice({ type: 'smartphone', model: '' });
        fetchDevices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это устройство?')) return;
    try {
      await fetch(`http://localhost:5000/api/client/cabinet/devices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('client_token')}` }
      });
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-semibold text-[var(--c-ink)] mb-4">Мои устройства</h1>
          <p className="text-[var(--c-ink-soft)] font-light">Список вашей техники, которую вы когда-либо сдавали в ремонт или добавили сами.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" /> Добавить
        </Button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-[var(--c-surface)] rounded-2xl" />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-20 bg-[var(--c-surface)] rounded-3xl border border-dashed border-[var(--c-border)]">
          <Smartphone className="mx-auto mb-6 text-[var(--c-ink-ghost)]" size={48} />
          <h3 className="text-xl font-display font-medium text-[var(--c-ink)] mb-2">Список пуст</h3>
          <p className="text-[var(--c-ink-soft)] font-light">Добавьте устройство вручную или оно появится после первого заказа.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <motion.div
              layout
              key={device.id}
              className="bg-[var(--c-surface)] border border-[var(--c-border)] p-8 rounded-2xl group hover:border-[var(--c-accent)]/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(device.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="w-12 h-12 bg-[var(--c-accent)]/10 rounded-xl flex items-center justify-center text-[var(--c-accent)] mb-6">
                {TYPE_ICONS[device.type.toLowerCase()] || TYPE_ICONS.default}
              </div>
              <h3 className="text-xl font-display font-medium text-[var(--c-ink)] mb-2">
                {device.model || device.type}
              </h3>
              <p className="text-[var(--c-ink-ghost)] text-xs uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Добавлено {format(new Date(device.createdAt), 'd MMM yyyy', { locale: ru })}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[var(--c-surface)] border border-[var(--c-border)] p-10 rounded-3xl shadow-2xl"
            >
              <h2 className="text-2xl font-display font-semibold text-[var(--c-ink)] mb-8">Новое устройство</h2>
              <form onSubmit={handleAddDevice} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[var(--c-ink-ghost)] text-[11px] uppercase tracking-widest font-bold">Тип устройства</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['smartphone', 'laptop', 'tv'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewDevice({ ...newDevice, type })}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                          newDevice.type === type 
                            ? 'bg-[var(--c-accent)]/10 border-[var(--c-accent)] text-[var(--c-accent)]' 
                            : 'bg-[var(--c-surface-2)] border-[var(--c-border)] text-[var(--c-ink-soft)]'
                        }`}
                      >
                        {React.cloneElement(TYPE_ICONS[type] as React.ReactElement, { size: 24 })}
                        <span className="text-[10px] uppercase font-bold">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Модель (например, iPhone 15 Pro)"
                  required
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                />

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">Добавить</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
