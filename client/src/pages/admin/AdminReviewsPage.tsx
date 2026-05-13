import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Trash2, Star, 
  MessageSquare, Clock, Smartphone 
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  deviceModel: string | null;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
}

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PUBLISHED' | 'REJECTED'>('PENDING');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/admin/content/reviews', { params: { status: activeTab } });
      if (response.data.success) setReviews(response.data.reviews);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [activeTab]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.patch(`/admin/content/reviews/${id}`, { status });
      fetchReviews();
    } catch (error) { alert('Ошибка модерации'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить отзыв навсегда?')) return;
    try {
      await adminApi.delete(`/admin/content/reviews/${id}`);
      fetchReviews();
    } catch (error) { alert('Ошибка удаления'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Модерация отзывов</h1>
        <p className="text-sm text-[#6B7280]">Проверка и управление клиентским фидбеком</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'PENDING', label: 'На модерации' },
          { id: 'PUBLISHED', label: 'Опубликованные' },
          { id: 'REJECTED', label: 'Отклоненные' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-6 py-4 text-sm font-medium transition-all relative
              ${activeTab === tab.id ? 'text-[#C8390B]' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="review-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8390B]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400">Загрузка...</div>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <motion.div 
                key={review.id} layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{format(new Date(review.createdAt), 'dd.MM.yyyy')}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-1">{review.author}</h3>
                {review.deviceModel && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#C8390B] font-bold uppercase tracking-wider mb-4">
                    <Smartphone className="w-3 h-3" /> {review.deviceModel}
                  </div>
                )}
                
                <p className="text-sm text-gray-600 leading-relaxed italic mb-6 flex-1">
                  «{review.text}»
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex gap-2">
                    {activeTab !== 'PUBLISHED' && (
                      <button 
                        onClick={() => handleStatusChange(review.id, 'PUBLISHED')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Опубликовать"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {activeTab !== 'REJECTED' && (
                      <button 
                        onClick={() => handleStatusChange(review.id, 'REJECTED')}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Отклонить"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Удалить"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              Отзывов в этой категории пока нет
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
