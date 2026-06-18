'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiShield, FiCpu, FiPlay, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-32 lg:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-gradient"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-start rtl:lg:text-start">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent py-4 leading-[1.2]"
            >
              {t('hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-6 md:mb-8"
            >
              {t('hero_subtitle')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-foreground/60 mb-8 md:mb-12 max-w-2xl mx-auto lg:mx-0"
            >
              {t('hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mb-12 md:mb-16"
            >
              <Link
                href="/tracks"
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary to-accent rounded-full text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary/50 text-center"
              >
                {t('start_journey')}
              </Link>
              <button
                className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-primary rounded-full text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlay className="group-hover:scale-125 transition-transform" />
                {t('video_btn')}
              </button>
            </motion.div>
          </div>

          {/* Video Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="relative aspect-video rounded-[2rem] p-[2px] bg-gradient-to-r from-primary/30 via-accent/30 to-cyan-400/30 hover:from-primary hover:via-accent hover:to-cyan-400 transition-all duration-500 shadow-2xl overflow-hidden">
              <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden bg-black">
                {/* HTML5 Video with full controls, playsInline, autoPlay, loop, muted by default for browser compliance */}
                <video
                  className="w-full h-full object-contain"
                  src="/intro%20arqam.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24"
        >
          {[
            { icon: FiCode, title: lang === 'en' ? 'Programming' : 'البرمجة', desc: lang === 'en' ? 'Master modern languages' : 'أتقن اللغات الحديثة' },
            { icon: FiShield, title: lang === 'en' ? 'Cybersecurity' : 'الأمن السيبراني', desc: lang === 'en' ? 'Protect digital assets' : 'حماية الأصول الرقمية' },
            { icon: FiCpu, title: lang === 'en' ? 'AI & ML' : 'الذكاء الاصطناعي', desc: lang === 'en' ? 'Build intelligent systems' : 'بناء أنظمة ذكية' },
          ].map((item, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-5 md:p-6 hover:scale-105 transition-transform border border-border/10 flex flex-col items-center text-center"
            >
              <item.icon className="w-10 h-10 md:w-12 md:h-12 text-primary mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm md:text-base text-foreground/60">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-50 p-2 md:p-3 rounded-full bg-black/50 hover:bg-red-500 hover:text-white text-white border border-white/10 transition-all duration-300 group hover:rotate-90"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close video"
              >
                <FiX className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Video Element */}
              <video
                src="/intro%20arqam.mp4"
                className="w-full h-full object-contain"
                autoPlay
                controls
                playsInline
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
