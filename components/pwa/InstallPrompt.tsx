'use client';

import React, { useEffect, useState } from 'react';
import { usePWA } from './PWAProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';
import Image from 'next/image';

export default function InstallPrompt() {
  const { isInstallable, isInstalled, deferredPrompt, hideInstallPrompt, showInstallPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      // Small delay to not show immediately on load
      const timer = setTimeout(() => {
        setIsVisible(true);
        showInstallPrompt();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, showInstallPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Track click
    fetch('/api/analytics/pwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'install_clicked' })
    }).catch(() => {});

    // Show native prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    } else {
      setIsVisible(false);
      hideInstallPrompt();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    hideInstallPrompt();
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-2xl p-5"
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
              {/* Fallback if logo is missing, user should place actual icon */}
              <Image src="/icons/icon-192x192.png" alt="IT-SPARK Logo" fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">أضف منصة IT-SPARK إلى جهازك</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                استمتع بتجربة أسرع وأسهل واستخدم المنصة كتطبيق حقيقي مباشرة من الشاشة الرئيسية.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/30"
            >
              <FiDownload size={18} />
              <span>تثبيت التطبيق</span>
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-all active:scale-95"
            >
              <span>لاحقًا</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
