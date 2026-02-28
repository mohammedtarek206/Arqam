'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FiMonitor, FiSmartphone, FiShield, FiCpu, FiBriefcase, FiCheck, FiArrowRight, FiBook, FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function PublicCoursesPage() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');

    const allCourses = [
        {
            id: 1,
            title: 'Full Stack Web Development with Next.js',
            instructor: 'Ahmed Shendy',
            price: '$49',
            thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop',
            track: 'web',
            trackName: 'Web Development',
            level: 'Beginner to Pro',
            duration: '40 Hours'
        },
        {
            id: 2,
            title: 'UI/UX Design Fundamentals',
            instructor: 'Sara Hassan',
            price: 'Free',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
            track: 'design',
            trackName: 'Design',
            level: 'Beginner',
            duration: '12 Hours'
        },
        {
            id: 3,
            title: 'Advanced Ethical Hacking',
            instructor: 'Omar Zaid',
            price: '$99',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
            track: 'cyber',
            trackName: 'Cyber Security',
            level: 'Advanced',
            duration: '60 Hours'
        },
        {
            id: 4,
            title: 'Flutter Mobile App Development',
            instructor: 'Mai Ahmed',
            price: '$59',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
            track: 'mobile',
            trackName: 'Mobile Development',
            level: 'Intermediate',
            duration: '45 Hours'
        },
        {
            id: 5,
            title: 'Machine Learning with Python',
            instructor: 'Dr. Tarek',
            price: '$79',
            thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop',
            track: 'ai',
            trackName: 'Artificial Intelligence',
            level: 'Intermediate',
            duration: '50 Hours'
        }
    ];

    const filteredCourses = filter === 'all' ? allCourses : allCourses.filter(c => c.track === filter);

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Explore Library
                    </h1>
                    <p className="text-gray-400 font-bold max-w-xl mx-auto">
                        Discover top-tier courses across multiple disciplines and master the skills you need.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        { id: 'all', name: 'All Courses' },
                        { id: 'web', name: 'Web Dev' },
                        { id: 'mobile', name: 'Mobile Dev' },
                        { id: 'cyber', name: 'Cyber Security' },
                        { id: 'ai', name: 'AI & Data' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filter === f.id ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {f.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, i) => (
                        <Link href={`/courses/${course.id}`} key={course.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all flex flex-col relative h-full cursor-pointer"
                            >
                                <div className="w-full h-48 relative overflow-hidden shrink-0">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
                                        <span className="text-xs font-black text-white">{course.price}</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark to-transparent" />
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between relative z-10 -mt-6">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-dark px-3 py-1 rounded w-max border border-white/5 mb-3">{course.trackName}</span>

                                    <div>
                                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight mb-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400">By {course.instructor}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mt-6 pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1.5"><FiBook /> {course.level}</span>
                                        <span className="flex items-center gap-1.5"><FiClock /> {course.duration}</span>
                                    </div>

                                    <div
                                        className="mt-6 w-full py-3 bg-white/5 group-hover:bg-primary group-hover:text-white text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                                    >
                                        Enroll Now
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
