import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, GripVertical, Save, X, Edit2, 
  CheckCircle, XCircle 
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Service {
  id: string;
  category: string;
  name: string;
  priceFrom: number;
  time: string;
  isActive: boolean;
  sortOrder: number;
}

const SortableItem = ({ service, onDelete, onUpdate }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...service });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    try {
      await adminApi.patch(`/admin/content/services/${service.id}`, editData);
      setIsEditing(false);
      onUpdate();
    } catch (error) { alert('Ошибка сохранения'); }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group bg-white border-b border-gray-100 flex items-center hover:bg-gray-50/50 transition-colors ${isDragging ? 'shadow-lg border-transparent rounded-lg mb-2' : ''}`}
    >
      <div {...attributes} {...listeners} className="px-4 py-4 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
        <GripVertical className="w-4 h-4" />
      </div>

      {isEditing ? (
        <div className="flex-1 grid grid-cols-12 gap-4 items-center px-4">
          <input className="col-span-4 text-sm font-medium outline-none border-b border-[#C8390B] pb-1" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
          <input className="col-span-2 text-sm outline-none border-b border-[#C8390B] pb-1" value={editData.time} onChange={e => setEditData({...editData, time: e.target.value})} />
          <input className="col-span-2 text-sm outline-none border-b border-[#C8390B] pb-1" type="number" value={editData.priceFrom} onChange={e => setEditData({...editData, priceFrom: e.target.value})} />
          <div className="col-span-4 flex justify-end gap-2">
            <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Save className="w-4 h-4" /></button>
            <button onClick={() => setIsEditing(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-12 gap-4 items-center px-4 py-4" onDoubleClick={() => setIsEditing(true)}>
          <div className="col-span-4 text-sm font-medium text-gray-900">{service.name}</div>
          <div className="col-span-2 text-sm text-gray-500">{service.time}</div>
          <div className="col-span-2 text-sm font-bold text-gray-900">от {service.priceFrom.toLocaleString()} ₽</div>
          <div className="col-span-1">
            {service.isActive ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
          </div>
          <div className="col-span-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-[#C8390B] hover:bg-gray-100 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => onDelete(service.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState({ category: '', name: '', priceFrom: '', time: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchServices = async () => {
    try {
      const response = await adminApi.get('/admin/content/services');
      if (response.data.success) setServices(response.data.services);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Отправляем новый порядок на бэкенд
        adminApi.patch('/admin/content/services/reorder', {
          orders: newArray.map((s, idx) => ({ id: s.id, sortOrder: idx }))
        });
        
        return newArray;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      await adminApi.delete(`/admin/content/services/${id}`);
      fetchServices();
    } catch (error) { alert('Ошибка удаления'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.post('/admin/content/services', newData);
      setIsModalOpen(false);
      setNewData({ category: '', name: '', priceFrom: '', time: '' });
      fetchServices();
    } catch (error) { alert('Ошибка добавления'); }
  };

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Прайс-лист</h1>
          <p className="text-sm text-[#6B7280]">Управление услугами и ценами на сайте</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#C8390B] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#C8390B]/20 hover:bg-[#A62F09] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Добавить услугу
        </button>
      </div>

      <div className="space-y-12 pb-20">
        {categories.map(cat => (
          <div key={cat} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8390B] px-4">{cat}</h2>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={services.filter(s => s.category === cat)} strategy={verticalListSortingStrategy}>
                  {services.filter(s => s.category === cat).map(service => (
                    <SortableItem 
                      key={service.id} 
                      service={service} 
                      onDelete={handleDelete} 
                      onUpdate={fetchServices}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleAdd}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6">Новая услуга</h3>
            <div className="space-y-4">
              <input required placeholder="Категория (Смартфоны, Ноутбуки...)" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={newData.category} onChange={e => setNewData({...newData, category: e.target.value})} />
              <input required placeholder="Название услуги" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={newData.name} onChange={e => setNewData({...newData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Срок (от 30 мин)" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={newData.time} onChange={e => setNewData({...newData, time: e.target.value})} />
                <input required type="number" placeholder="Цена от (₽)" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C8390B]" value={newData.priceFrom} onChange={e => setNewData({...newData, priceFrom: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50">Отмена</button>
              <button type="submit" className="flex-1 py-3 bg-[#C8390B] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#C8390B]/20 hover:bg-[#A62F09]">Создать</button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
};
