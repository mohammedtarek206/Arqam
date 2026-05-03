'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  FiBriefcase, FiGlobe, FiDatabase, FiShield, 
  FiCode, FiZap, FiLayers, FiPenTool, FiArrowRight 
} from 'react-icons/fi';

interface CourseLink {
  _id: string;
  title: string;
  slug?: string;
}

interface TrackWithCourses {
  _id: string;
  title: string;
  icon: string;
  courses: CourseLink[];
  slug?: string;
}

interface MegaMenuProps {
  tracks: TrackWithCourses[];
  onClose: () => void;
}

export default function MegaMenu({ tracks, onClose }: MegaMenuProps) {
  const { lang, t } = useLanguage();

  const getIcon = (iconName: string, title: string) => {
    const t = title.toLowerCase();
    if (t.includes('business') || t.includes('إدارة')) return <FiBriefcase />;
    if (t.includes('network') || t.includes('شبكات')) return <FiGlobe />;
    if (t.includes('data') || t.includes('بيانات')) return <FiDatabase />;
    if (t.includes('security') || t.includes('أمن')) return <FiShield />;
    if (t.includes('software') || t.includes('برمجة') || t.includes('web')) return <FiCode />;
    if (t.includes('digital') || t.includes('تحول')) return <FiZap />;
    if (t.includes('design') || t.includes('تصميم') || t.includes('graphic')) return <FiPenTool />;
    if (t.includes('engineering') || t.includes('هندسة')) return <FiLayers />;
    return <FiLayers />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-[#0a0a1a] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[1.5rem] overflow-hidden w-full max-w-7xl mx-auto relative z-[100]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
        {tracks.length > 0 ? tracks.map((track) => (
          <div key={track._id} className="bg-[#0f0f25] flex flex-col group/track">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 flex items-center gap-4 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl shadow-lg">
                {getIcon(track.icon, track.title)}
              </div>
              <h3 className="font-black text-white text-sm uppercase tracking-wider leading-tight">
                {track.title}
              </h3>
            </div>

            {/* Course List */}
            <div className="p-6 flex-grow">
              <ul className="space-y-3 mb-8">
                {track.courses && track.courses.length > 0 ? (
                  track.courses.slice(0, 6).map((course) => (
                    <li key={course._id}>
                      <Link
                        href={`/courses/${course._id}`}
                        onClick={onClose}
                        className="text-[13px] font-bold text-foreground/60 hover:text-primary transition-all flex items-center gap-3 group/item"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover/item:bg-primary group-hover/item:scale-125 transition-all" />
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-foreground/30 italic py-4">
                    {lang === 'ar' ? 'جاري إضافة الكورسات...' : 'Adding courses soon...'}
                  </li>
                )}
              </ul>

              {/* Explore All Link */}
              <Link
                href={`/tracks/${track._id}`}
                onClick={onClose}
                className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-foreground/[0.03] border border-border/50 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 mt-auto"
              >
                <span>{lang === 'ar' ? 'استكشف المسار بالكامل' : 'EXPLORE ENTIRE TRACK'}</span>
                <FiArrowRight className="text-sm rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )) : (
          // Empty State / Placeholder
          <div className="col-span-4 py-20 text-center">
            <p className="text-foreground/40 font-bold uppercase tracking-widest">
              {lang === 'ar' ? 'لا يوجد بيانات حالياً' : 'No data available yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Bottom bar */}
      <div className="bg-foreground/[0.05] p-5 flex justify-between items-center border-t border-border/50 px-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">
            {lang === 'ar' ? 'منصة أرقام التعليمية - ٢٠٢٤' : 'ARQAM LEARNING PLATFORM - 2024'}
          </p>
        </div>
        <Link 
          href="/courses" 
          onClick={onClose}
          className="text-[10px] font-black text-primary hover:text-accent uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          {lang === 'ar' ? 'تصفح كل الكورسات' : 'BROWSE ALL COURSES'}
          <FiArrowRight className="rtl:rotate-180" />
        </Link>
      </div>
    </motion.div>
  );
}
