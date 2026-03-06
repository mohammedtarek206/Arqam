'use client';

import { motion } from 'framer-motion';
import { FiCode, FiShield, FiCpu, FiPlay } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
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
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-cyber bg-clip-text text-transparent"
            >
              {t('hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-foreground/80 mb-8"
            >
              {t('hero_subtitle')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-foreground/60 mb-12 max-w-2xl mx-auto lg:mx-0"
            >
              {t('hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16"
            >
              <Link
                href="/tracks"
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary/50"
              >
                {t('start_journey')}
              </Link>
              <button
                className="px-8 py-4 border-2 border-primary rounded-full text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center gap-2 group"
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              >
                <FiPlay className="group-hover:scale-125 transition-transform" />
                {t('video_btn')}
              </button>
            </motion.div>
          </div>

          {/* Video / Visual Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                  <FiPlay className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              {/* This would be an iframe in production */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <p className="text-white font-bold text-sm">Welcome to Arqam Academy</p>
                <p className="text-gray-400 text-xs mt-1">Discover your potential with us</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          {[
            { icon: FiCode, title: lang === 'en' ? 'Programming' : 'البرمجة', desc: lang === 'en' ? 'Master modern languages' : 'أتقن اللغات الحديثة' },
            { icon: FiShield, title: lang === 'en' ? 'Cybersecurity' : 'الأمن السيبراني', desc: lang === 'en' ? 'Protect digital assets' : 'حماية الأصول الرقمية' },
            { icon: FiCpu, title: lang === 'en' ? 'AI & ML' : 'الذكاء الاصطناعي', desc: lang === 'en' ? 'Build intelligent systems' : 'بناء أنظمة ذكية' },
          ].map((item, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:scale-105 transition-transform border border-border/10"
            >
              <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-center text-foreground">{item.title}</h3>
              <p className="text-foreground/60 text-center">{item.desc}</p>
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
    </section>
  );
}
