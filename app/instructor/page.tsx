'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import {
    FiUsers, FiEye, FiStar, FiDollarSign,
    FiBell, FiChevronRight, FiCheckCircle, FiClock, FiMessageSquare
} from 'react-icons/fi';

export default function InstructorOverview() {
    const { t, lang } = useLanguage();
    const { user } = useAuth();

    const stats = [
        { title: t('total_students'), value: '1,250', icon: <FiUsers />, color: 'bg-blue-500' },
        { title: t('course_views'), value: '45,000', icon: <FiEye />, color: 'bg-purple-500' },
        { title: t('avg_rating'), value: '4.8', icon: <FiStar />, color: 'bg-yellow-500' },
        { title: t('earnings'), value: '$4,200', icon: <FiDollarSign />, color: 'bg-green-500' },
    ];

    const notifications = [
        { id: 1, text: 'New student enrolled in "Web Development Level 1"', time: '2 mins ago' },
        { id: 2, text: 'Student submitted project for "UI/UX Design"', time: '1 hour ago' },
        { id: 3, text: 'Admin approved your new Python course', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                        {t('instructor_dashboard')}
                    </h1>
                    <p className="text-gray-400 font-bold mt-1">
                        Welcome back, {user?.name}! 👋
                    </p>
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-bold">
                    <FiBell className="text-primary" />
                    {t('notifications')}
                    <span className="bg-primary text-[10px] text-white px-1.5 py-0.5 rounded-full ml-1">4</span>
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-all`} />
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center text-xl text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.title}</h3>
                        <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Notifications */}
                <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-white uppercase">{t('notifications')}</h2>
                        <button className="text-xs font-bold text-primary hover:underline">{t('explore_tracks')}</button>
                    </div>
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <FiBell />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{notif.text}</p>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-1"><FiClock /> {notif.time}</p>
                                </div>
                                <FiChevronRight className={`text-gray-600 group-hover:text-white transition-all ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                    <h2 className="text-xl font-black text-white mb-6 uppercase">Quick Actions</h2>
                    <div className="space-y-4">
                        <button className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                            <FiPlus className="w-5 h-5" /> {t('create_course')}
                        </button>
                        <button className="w-full py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2">
                            <FiPlus className="w-5 h-5" /> {t('create_exam')}
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <FiMessageSquare className="w-5 h-5" /> {t('send_announcement')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FiPlus({ className }: { className?: string }) {
    return (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
    );
}
