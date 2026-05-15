import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Phone, MessageCircle, Send } from 'lucide-react';

const TELEGRAM_USER = import.meta.env.VITE_CONTACT_TELEGRAM || 'techrepair_support';
const WHATSAPP_PHONE = import.meta.env.VITE_CONTACT_WHATSAPP || '79990000000';
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+7 (999) 000-00-00';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const menuVariants = {
    closed: { opacity: 0, scale: 0.7, y: 10, transition: { duration: 0.2, ease: "easeIn" } },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 10 },
    open: { opacity: 1, x: 0 }
  };

  const channels = [
    { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-[#25D366]', link: `https://wa.me/${WHATSAPP_PHONE}`, label: 'WhatsApp' },
    { name: 'Telegram', icon: <Send size={20} />, color: 'bg-[#0088cc]', link: `https://t.me/${TELEGRAM_USER}`, label: 'Telegram' },
    { name: 'Телефон', icon: <Phone size={20} />, color: 'bg-[var(--c-accent)]', link: `tel:${CONTACT_PHONE.replace(/\D/g, '')}`, label: 'Позвонить' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="flex flex-col items-end gap-3 mb-1"
          >
            {channels.map((channel) => (
              <motion.a
                key={channel.name}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="flex items-center gap-3 group"
              >
                <span className="bg-[var(--c-surface)] text-[var(--c-ink)] text-[11px] font-bold uppercase tracking-widest py-2 px-4 rounded-xl border border-[var(--c-border)] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {channel.label}
                </span>
                <div className={`w-12 h-12 ${channel.color} text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95`}>
                  {channel.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden transition-colors duration-300 ${
              isOpen ? 'bg-[var(--c-surface-2)] text-[var(--c-ink)]' : 'bg-[var(--c-accent)] text-white'
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="msg"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-white/20 -z-10"
                  />
                  <MessageSquare size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
