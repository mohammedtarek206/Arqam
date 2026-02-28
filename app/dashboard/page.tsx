'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiAward, FiClock, FiActivity, FiArrowRight, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function StudentDashboardOverview() {
    const { t, lang } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Use mock data for now to show the design
    const metrics = [
        { title: 'Courses in Progress', value: '3', icon: <FiActivity />, color: 'text-primary' },
        { title: 'Completed Courses', value: '1', icon: <FiAward />, color: 'text-green-500' },
        { title: 'Learning Hours', value: '42h', icon: <FiClock />, color: 'text-accent' },
    ];

    const currentCourses = [
        {
            id: 1,
            title: 'Full Stack Web Development with Next.js',
            instructor: 'Ahmed Shendy',
            progress: 65,
            thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop',
            nextLesson: 'Building the REST API',
            track: 'Web Development'
        },
        {
            id: 2,
            title: 'UI/UX Design Fundamentals',
            instructor: 'Sara Hassan',
            progress: 20,
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
            nextLesson: 'Color Theory',
            track: 'Design'
        }
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="text-primary animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                    {t('welcome_back') || 'WELCOME BACK'}, <span className="text-primary">{user?.name?.split(' ')[0].toUpperCase() || 'STUDENT'}</span>
                </h1>
                <p className="text-gray-400 font-bold mt-1">Ready to continue your journey?</p>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shrink-0 ${m.color} group-hover:scale-110 transition-transform`}>
                            {m.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.title}</p>
                            <h3 className="text-3xl font-black text-white">{m.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Continue Learning */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white uppercase">{t('my_courses')}</h2>
                    <Link href="/dashboard/courses" className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
                        View All <FiArrowRight className="rtl:rotate-180" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {currentCourses.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-primary/30 transition-all flex flex-col sm:flex-row relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-all" />

                            <div className="w-full sm:w-48 h-48 sm:h-full relative overflow-hidden shrink-0">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-white/10">{course.track}</span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors leading-tight mb-2">
                                        {course.title}
                                    </h3>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span className="text-white">{course.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <Link
                                        href={`/learn/${course.id}`}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-black text-white uppercase transition-all group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                                    >
                                        <FiPlayCircle className="text-lg" /> Continue: {course.nextLesson}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
