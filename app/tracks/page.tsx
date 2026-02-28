'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FiMonitor, FiSmartphone, FiShield, FiCpu, FiBriefcase, FiArrowRight, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

export default function TracksExplorer() {
  const { t, lang } = useLanguage();
  const [activeTrack, setActiveTrack] = useState<number | null>(null);

  const tracks = [
    {
      id: 1,
      name: t('track_web'),
      icon: <FiMonitor />,
      color: 'from-blue-600 to-cyan-400',
      description: t('track_web_desc'),
      courses: 8,
      duration: '6 Months',
      features: ['HTML/CSS/JS', 'React & Next.js', 'Node.js & MongoDB', 'Cloud Deployment']
    },
    {
      id: 2,
      name: t('track_cyber'),
      icon: <FiShield />,
      color: 'from-accent to-pink-500',
      description: t('track_cyber_desc'),
      courses: 10,
      duration: '8 Months',
      features: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment']
    },
    {
      id: 3,
      name: t('track_ai'),
      icon: <FiCpu />,
      color: 'from-purple-600 to-indigo-500',
      description: t('track_ai_desc'),
      courses: 7,
      duration: '5 Months',
      features: ['Python Basics', 'Machine Learning', 'Deep Learning', 'Computer Vision']
    },
    {
      id: 4,
      name: t('track_mobile'),
      icon: <FiSmartphone />,
      color: 'from-emerald-500 to-teal-400',
      description: t('track_mobile_desc'),
      courses: 6,
      duration: '4 Months',
      features: ['Dart Programming', 'Flutter Framework', 'State Management', 'App Publishing']
    },
    {
      id: 5,
      name: t('track_freelancing'),
      icon: <FiBriefcase />,
      color: 'from-orange-500 to-yellow-400',
      description: t('track_freelancing_desc'),
      courses: 3,
      duration: '2 Months',
      features: ['Profile Building', 'Client Acquisition', 'Pricing Strategies', 'Communication Skills']
    }
  ];

  return (
    <div className="min-h-screen bg-dark py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-16 mt-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-white/10 backdrop-blur-md">Career Paths</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            {t('tracks_subtitle')}
          </h1>
          <p className="text-lg text-gray-400 font-medium pt-2">
            Carefully curated learning paths designed to take you from a beginner to an industry-ready professional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setActiveTrack(track.id)}
              onMouseLeave={() => setActiveTrack(null)}
              className={`glass p-8 md:p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden group ${activeTrack === track.id ? 'border-white/20 scale-[1.02] shadow-2xl' : 'border-white/5'
                }`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 rounded-full`} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center text-3xl text-white shadow-lg`}>
                  {track.icon}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{track.courses} Courses</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{track.duration}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{track.name}</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">{track.description}</p>
              </div>

              <div className="space-y-3 mb-10 relative z-10">
                {track.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shrink-0 text-white group-hover:bg-white group-hover:text-black transition-colors">
                      <FiCheck className="text-xs font-bold" />
                    </div>
                    <span className="text-xs font-bold text-gray-300">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/tracks/${track.id}`}
                className="w-full py-4 bg-white/5 group-hover:bg-white group-hover:text-dark text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10 relative z-10"
              >
                View Syllabus <FiArrowRight className={`text-lg transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
