'use client';

import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiHome, FiBook, FiAward, FiUser,
    FiSettings, FiLogOut, FiActivity, FiCreditCard
} from 'react-icons/fi';

export default function StudentSidebar() {
    const { user, logout } = useAuth();
    const { t, lang } = useLanguage();
    const pathname = usePathname();

    const navItems = [
        { name: t('dashboard'), href: '/dashboard', icon: <FiHome /> },
        { name: t('my_courses'), href: '/dashboard/courses', icon: <FiBook /> },
        { name: t('certificates'), href: '/dashboard/certificates', icon: <FiAward /> },
        { name: lang === 'ar' ? 'المشتريات' : 'Purchases', href: '/dashboard/purchases', icon: <FiCreditCard /> },
        { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: <FiAward /> },
        { name: 'Progress', href: '/dashboard/progress', icon: <FiActivity /> },
        { name: t('profile'), href: '/dashboard/profile', icon: <FiUser /> },
    ];

    return (
        <aside className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-72 bg-black/40 backdrop-blur-xl border-${lang === 'ar' ? 'l' : 'r'} border-white/5 z-40 flex flex-col hidden lg:flex`}>
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Image
                            src="/logo.png"
                            alt="Arqam Academy Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <span className="text-lg font-black text-white block leading-tight">{t('hero_title')}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('role_student')}</span>
                    </div>
                </Link>
            </div>

            <div className="px-8 pb-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-black uppercase">
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white rtl:tracking-normal ltr:tracking-tight">{user?.name || 'Student Name'}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{user?.targetGoal || 'Learning'}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto w-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all relative ${isActive
                                ? 'text-white'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabStudent"
                                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className={`text-xl ${isActive ? 'text-primary' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="uppercase tracking-widest text-xs relative top-0.5">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto w-full">
                <div className="glass p-4 rounded-2xl border border-white/5 space-y-2">
                    <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                        <FiSettings className="text-lg" /> Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest"
                    >
                        <FiLogOut className="text-lg" /> {t('logout')}
                    </button>
                </div>
            </div>
        </aside>
    );
}
