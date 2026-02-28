'use client';

import React from 'react';
import InstructorSidebar from '@/components/instructor/InstructorSidebar';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function InstructorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { lang } = useLanguage();

    if (isLoading) return null;

    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-dark text-white">
            <InstructorSidebar />
            <div className={`${lang === 'ar' ? 'md:mr-64' : 'md:ml-64'} min-h-screen p-4 md:p-8 transition-all`}>
                <div className="max-w-7xl mx-auto pt-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
