'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { FiUsers, FiBookOpen, FiBriefcase } from 'react-icons/fi';

export default function Stats() {
    const { t } = useLanguage();

    const stats = [
        {
            icon: FiUsers,
            value: '1,200+',
            label: t('stats_students'),
            color: 'from-primary to-blue-600',
        },
        {
            icon: FiBookOpen,
            value: '45+',
            label: t('stats_courses'),
            color: 'from-accent to-emerald-600',
        },
        {
            icon: FiBriefcase,
            value: '94%',
            label: t('stats_employment'),
            color: 'from-cyber to-purple-600',
        },
    ];

    return (
        <section className="py-20 bg-dark/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl -z-10" />
                            <div className="glass h-full p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
