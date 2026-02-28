'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { FiHexagon, FiZap, FiTarget, FiGlobe, FiRadio, FiSmile } from 'react-icons/fi';

export default function Partners() {
    const { t } = useLanguage();

    const partners = [
        { name: 'TechCorp', icon: FiHexagon },
        { name: 'GrowthScale', icon: FiZap },
        { name: 'GlobalNet', icon: FiGlobe },
        { name: 'VisionAI', icon: FiTarget },
        { name: 'Streamline', icon: FiRadio },
        { name: 'SoftSys', icon: FiSmile },
    ];

    return (
        <section className="py-24 bg-dark-light/30 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold mb-4 text-gray-400"
                    >
                        {t('partners_title')}
                    </motion.h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-3 group px-6 py-3 rounded-2xl hover:bg-white/5 hover:opacity-100 transition-all cursor-default border border-transparent hover:border-white/10"
                        >
                            <partner.icon className="w-8 h-8 text-primary group-hover:scale-125 transition-transform" />
                            <span className="text-2xl font-black text-white/50 group-hover:text-white transition-colors tracking-tighter">
                                {partner.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
