import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import adminApi from '../../api/adminApi';

export const AdminPageEditor: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await adminApi.get(`/admin/content/pages/${slug}`);
        if (response.data.success) {
          setTitle(response.data.page.title);
          setContent(response.data.page.content);
        }
      } catch (error) {
        console.error('Failed to fetch page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.put(`/admin/content/pages/${slug}`, { title, content });
      alert('Страница сохранена');
    } catch (error) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка редактора...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/content/pages')} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-[#C8390B] transition-all"
            placeholder="Заголовок страницы"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#C8390B] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#C8390B]/20 hover:bg-[#A62F09] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : <><Save className="w-4 h-4" /> Сохранить изменения</>}
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm" data-color-mode="light">
        <MDEditor
          value={content}
          onChange={setContent}
          height="calc(100vh - 250px)"
          preview="live"
          className="border-none"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Используйте синтаксис <strong>Markdown</strong> для форматирования текста. 
          Все изменения будут мгновенно отображены в правой панели превью. 
          Не забудьте нажать «Сохранить», чтобы изменения вступили в силу на сайте.
        </p>
      </div>
    </motion.div>
  );
};
