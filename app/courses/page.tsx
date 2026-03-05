'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FiMonitor, FiSmartphone, FiShield, FiCpu, FiBriefcase, FiCheck, FiArrowRight, FiBook, FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function PublicCoursesPage() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = filter === 'all' ? courses : courses.filter(c => c.category === filter || c.trackName?.toLowerCase().includes(filter));

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-32 pb-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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
                        <Link href={`/courses/${course._id || course.id}`} key={course._id || course.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all flex flex-col relative h-full cursor-pointer"
                            >
                                <div className="w-full h-48 relative overflow-hidden shrink-0">
                                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
                                        <span className="text-xs font-black text-white">{course.isFree ? 'Free' : `${course.price} EGP`}</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark to-transparent" />
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between relative z-10 -mt-6">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-dark px-3 py-1 rounded w-max border border-white/5 mb-3">{course.category || 'Professional'}</span>

                                    <div>
                                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight mb-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400">By {course.instructor?.name || 'Instructor'}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mt-6 pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1.5"><FiBook /> {course.level || 'All Levels'}</span>
                                        <span className="flex items-center gap-1.5"><FiClock /> 40 Hours</span>
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
                {filteredCourses.length === 0 && (
                    <p className="text-center text-gray-500 font-bold py-12">No courses found matching this category.</p>
                )}
            </div>
        </div>
    );
}
