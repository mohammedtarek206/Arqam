'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { FiArrowRight, FiBook } from 'react-icons/fi';

interface CourseLink {
  _id: string;
  title: string;
  category?: string;
  level?: string;
}

interface MegaMenuProps {
  courses?: CourseLink[];
  onClose: () => void;
}

export default function MegaMenu({ courses = [], onClose }: MegaMenuProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-[#0a0a1a] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[1.5rem] overflow-hidden w-full max-w-7xl mx-auto relative z-[100]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent px-8 py-5 flex items-center gap-3">
        <FiBook className="text-white text-xl" />
        <h3 className="font-black text-white text-sm uppercase tracking-wider">
          {lang === 'ar' ? 'الكورسات المتاحة' : 'Available Courses'}
        </h3>
      </div>

      {/* Courses Grid */}
      <div className="p-6">
        {courses.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.slice(0, 9).map((course) => (
              <li key={course._id}>
                <Link
                  href={`/courses/${course._id}`}
                  onClick={onClose}
                  className="text-[13px] font-bold text-foreground/60 hover:text-primary transition-all flex items-center gap-3 group/item p-2 rounded-xl hover:bg-white/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover/item:bg-primary group-hover/item:scale-125 transition-all shrink-0" />
                  <span className="truncate">{course.title}</span>
                  {course.level && (
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-foreground/30 shrink-0">{course.level}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">
              {lang === 'ar' ? 'لا توجد كورسات حالياً' : 'No courses available yet'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-foreground/[0.05] p-5 flex justify-between items-center border-t border-border/50 px-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">
            {lang === 'ar' ? 'منصة أرقام التعليمية' : 'ARQAM LEARNING PLATFORM'}
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
