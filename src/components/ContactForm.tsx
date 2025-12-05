import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, type RepairRequest } from '../lib/supabase';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface ContactFormProps {
  defaultDeviceType?: string;
}

export default function ContactForm({ defaultDeviceType }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deviceType: defaultDeviceType || '',
    problem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured) {
        alert('Для работы формы необходимо настроить подключение к Supabase. Пожалуйста, обратитесь к администратору.');
        return;
      }

      const repairRequest: Omit<RepairRequest, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        phone: formData.phone,
        device_type: formData.deviceType || undefined,
        problem: formData.problem || undefined,
        status: 'new'
      };

      const { data, error: dbError } = await supabase
        .from('repair_requests')
        .insert([repairRequest])
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      const { error: telegramError } = await supabase.functions.invoke(
        'send-telegram-notification',
        {
          body: repairRequest
        }
      );

      if (telegramError) {
        console.warn('Telegram notification failed:', telegramError);
      }

      setIsSubmitted(true);
      setFormData({ name: '', phone: '', deviceType: defaultDeviceType || '', problem: '' });
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или позвоните нам напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-gray-600 mb-6">
          Мы свяжемся с вами в ближайшее время
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Оставить еще одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ваше имя *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Введите ваше имя"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Номер телефона *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+7 (961) 242-75-51"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Тип устройства
        </label>
        <select
          name="deviceType"
          value={formData.deviceType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Выберите тип устройства</option>
          <option value="smartphone">Смартфон</option>
          <option value="tv">Телевизор</option>
          <option value="laptop">Ноутбук</option>
          <option value="pc">Компьютер</option>
          <option value="other">Другое</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Описание проблемы
        </label>
        <textarea
          name="problem"
          value={formData.problem}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Опишите, что случилось с вашим устройством..."
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Отправляем...
          </>
        ) : (
          <>
            Отправить заявку
            <ChevronRight className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
      
      <p className="text-sm text-gray-500 text-center">
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
      </p>
    </form>
  );
}