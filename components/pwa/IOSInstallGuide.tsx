'use client';

import React from 'react';
import { usePWA } from './PWAProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShare, FiPlusSquare } from 'react-icons/fi';
import Image from 'next/image';

export default function IOSInstallGuide() {
  const { isIOS, showIOSPrompt, setShowIOSPrompt, isInstalled } = usePWA();

  const handleDismiss = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('iosPwaPromptDismissed', 'true');
  };

  if (!isIOS || !showIOSPrompt || isInstalled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-2xl p-5"
        dir="rtl"
      >
        <button 
          onClick={handleDismiss}
          className="absolute top-3 left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-primary/10 flex items-center justify-center">
            <Image src="/icons/icon-192x192.png" alt="Arqam Logo" fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">أضف Arqam لجهازك</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              استمتع بتجربة أسرع وأسهل مباشرة من الشاشة الرئيسية.
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-2">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">
            لتثبيت التطبيق على جهازك:
          </p>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm text-primary">
                <FiShare size={16} />
              </span>
              <span>1. اضغط على زر <strong>المشاركة</strong> في الأسفل.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm text-primary">
                <FiPlusSquare size={16} />
              </span>
              <span>2. اختر <strong>إضافة إلى الشاشة الرئيسية</strong>.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm text-primary font-bold">
                إضافة
              </span>
              <span>3. اضغط <strong>إضافة</strong> أعلى الشاشة.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
