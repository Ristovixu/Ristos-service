import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Page {
  slug: string;
  title: string;
  updatedAt: string;
}

export const AdminPagesList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await adminApi.get('/admin/content/pages');
        if (response.data.success) setPages(response.data.pages);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchPages();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Управление страницами</h1>
        <p className="text-sm text-[#6B7280]">Редактирование текстового контента сайта (Markdown)</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-gray-400">Загрузка...</div>
        ) : pages.length > 0 ? (
          pages.map(page => (
            <Link 
              key={page.slug}
              to={`/admin/content/pages/${page.slug}`}
              className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 flex items-center justify-between hover:border-[#C8390B] transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#C8390B] group-hover:bg-[#C8390B]/5 transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{page.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{page.slug}</span>
                    <span className="text-gray-200">•</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Обновлено: {format(new Date(page.updatedAt), 'dd MMM yyyy', { locale: ru })}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#C8390B] transition-all" />
            </Link>
          ))
        ) : (
          <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400">Страницы еще не созданы в БД.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
