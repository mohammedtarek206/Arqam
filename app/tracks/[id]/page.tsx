'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
    FiMonitor, FiSmartphone, FiShield, FiCpu, FiBriefcase,
    FiArrowRight, FiCheck, FiAward, FiClock, FiBook
} from 'react-icons/fi';
import Link from 'next/link';

export default function TrackDetailPage() {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const params = useParams();
    const trackId = params.id as string;

    // Render a specific mock track based on the ID param linked from Navbar
    const getTrackInfo = (id: string) => {
        switch (id) {
            case 'web':
                return {
                    name: 'Web Development', title: 'Master Full Stack Web Development',
                    desc: 'Learn to build modern, scalable web applications from scratch using React, Next.js, Node.js, and MongoDB. Become a certified full-stack engineer ready for the tech industry.',
                    color: 'from-blue-600 to-cyan-400', icon: <FiMonitor />, courses: 8, duration: '6 Months'
                };
            case 'mobile':
                return {
                    name: 'Mobile Development', title: 'Cross-Platform App Development',
                    desc: 'Master Flutter and Dart to build visually stunning, performant mobile applications for both iOS and Android from a single codebase.',
                    color: 'from-emerald-500 to-teal-400', icon: <FiSmartphone />, courses: 6, duration: '4 Months'
                };
            case 'cyber':
                return {
                    name: 'Cyber Security', title: 'Advanced Network & Cyber Security',
                    desc: 'Equip yourself with the skills to defend networks, master ethical hacking, and conduct advanced risk assessments to protect digital assets.',
                    color: 'from-accent to-pink-500', icon: <FiShield />, courses: 10, duration: '8 Months'
                };
            case 'ai':
                return {
                    name: 'Artificial Intelligence', title: 'AI & Machine Learning Engineering',
                    desc: 'Dive into the world of AI. Learn Python, build machine learning models, and understand deep learning concepts for the future of tech.',
                    color: 'from-purple-600 to-indigo-500', icon: <FiCpu />, courses: 7, duration: '5 Months'
                };
            case 'soft-skills':
                return {
                    name: 'Freelancing & Soft Skills', title: 'Start Your Independent Career',
                    desc: 'Learn how to market your technical skills, acquire clients globally, and maintain standard communication and pricing strategies.',
                    color: 'from-orange-500 to-yellow-400', icon: <FiBriefcase />, courses: 3, duration: '2 Months'
                };
            default:
                return {
                    name: 'Learning Track', title: 'Accelerate Your Tech Career',
                    desc: 'Join this comprehensive track to build real-world projects and acquire in-demand skills.',
                    color: 'from-primary to-accent', icon: <FiAward />, courses: 5, duration: '3 Months'
                };
        }
    };

    const track = getTrackInfo(trackId);

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl ${track.color} opacity-10 rounded-full blur-[120px] pointer-events-none`} />

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${track.color} flex items-center justify-center text-4xl text-white shadow-2xl shadow-primary/20`}>
                            {track.icon}
                        </div>

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{track.name} Track</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mt-4 uppercase tracking-tighter">
                                {track.title}
                            </h1>
                        </div>

                        <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
                            {track.desc}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                            <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <FiBook className="text-2xl text-primary" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Included</p>
                                    <p className="text-lg font-black text-white">{track.courses} Courses</p>
                                </div>
                            </div>
                            <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <FiClock className="text-2xl text-accent" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimated</p>
                                    <p className="text-lg font-black text-white">{track.duration}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href={user ? '/dashboard' : '/signup'} className={`px-8 py-4 bg-gradient-to-r ${track.color} text-white font-black uppercase text-sm rounded-2xl shadow-xl flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                                {user ? 'Continue Learning' : 'Enroll in Track'} <FiArrowRight className={lang === 'ar' ? 'rotate-180' : ''} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Curriculum Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/10 relative"
                    >
                        <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">Track Syllabus</h3>

                        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 rtl:before:right-4 before:w-0.5 before:bg-white/5">
                            {[
                                { step: 1, title: 'Fundamentals & Basics', desc: 'Lay the groundwork and learn the core languages and tools.' },
                                { step: 2, title: 'Intermediate Concepts', desc: 'Dive deeper into frameworks and standard industry practices.' },
                                { step: 3, title: 'Advanced Architecture', desc: 'Master advanced design patterns and performance optimization.' },
                                { step: 4, title: 'Final Capstone Project', desc: 'Build and deploy a comprehensive project to graduate.' },
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex gap-6 group">
                                    <div className="w-8 h-8 rounded-full bg-dark border-2 border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary/20 transition-all">
                                        <span className="text-xs font-black text-white">{item.step}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white leading-none mb-2">{item.title}</h4>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
                            <FiAward className="text-3xl text-yellow-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-sm font-black text-white mb-1">Official Certification</h4>
                                <p className="text-xs text-gray-400 font-bold">Complete all courses and the capstone project to earn your verified industry-recognized certificate.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
