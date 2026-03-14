'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaVideo, FaClock, FaBookOpen, FaUserGraduate } from 'react-icons/fa';
import CourseCard from '@/components/CourseCard';
import VideoCard from '@/components/VideoCard';

const TrackDetailPage = () => {
    const params = useParams();
    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/tracks/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setTrack(data);
                }
            } catch (err) {
                console.error('Error fetching track:', err);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) fetchTrack();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!track) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
                Track not found.
            </div>
        );
    }

    const lessons = track.lessons || [];
    const courses = track.associatedCourses || track.courses || [];
    const isRtl = true; // Hardcoded for this context as requested

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={track.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'}
                        alt={track.title}
                        fill
                        className="object-cover brightness-[0.3]"
                    />
                </div>
                <div className="relative z-10 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-black uppercase tracking-widest mb-6"
                    >
                        {track.level} Track
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter"
                    >
                        {track.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-300 max-w-2xl mx-auto font-medium"
                    >
                        {track.description}
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-20 relative z-20">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: FaBookOpen, label: isRtl ? 'كورس محتوى' : 'Courses', value: courses.length },
                        { icon: FaVideo, label: isRtl ? 'درس مرئي' : 'Lessons', value: lessons.length },
                        { icon: FaClock, label: isRtl ? 'المدة' : 'Duration', value: track.duration },
                        { icon: FaUserGraduate, label: isRtl ? 'المستوى' : 'Level', value: track.level },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3">
                                <stat.icon size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Courses Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {isRtl ? 'الكورسات المشمولة' : 'Included Courses'}
                        </h2>
                    </div>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {courses.map((course: any) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                {isRtl ? 'لا يوجد كورسات مربوطة بهذا المسار حالياً' : 'No courses linked to this track yet.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Lessons Section */}
                <div>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {isRtl ? 'المحتوى التعليمي (فيديوهات)' : 'Track Lessons (Videos)'}
                        </h2>
                    </div>
                    {lessons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {lessons.map((lesson: any, index: number) => (
                                <VideoCard
                                    key={index}
                                    video={{
                                        ...lesson,
                                        _id: `lesson-${index}`,
                                        trackTitle: track.title,
                                        createdAt: track.createdAt
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                {isRtl ? 'لا يوجد فيديوهات في هذا المسار حالياً' : 'No lessons added to this track yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackDetailPage;
