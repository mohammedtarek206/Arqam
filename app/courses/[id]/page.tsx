'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiAward, FiStar, FiPlayCircle, FiCheck, FiArrowRight, FiShield } from 'react-icons/fi';
import Link from 'next/link';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock specific course data based on ID, in a real app this would be an API fetch
    const courseId = Number(params.id) || 1;
    const course = {
        id: courseId,
        title: courseId === 1 ? 'Full Stack Web Development with Next.js' :
            courseId === 2 ? 'UI/UX Design Fundamentals' :
                courseId === 3 ? 'Advanced Ethical Hacking' : 'Course Details',
        instructor: 'Ahmed Shendy',
        price: courseId === 2 ? 'Free' : '$49',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=600&fit=crop',
        trackName: courseId === 2 ? 'Design' : 'Web Development',
        level: 'Beginner to Pro',
        duration: '40 Hours',
        studentsCount: 1245,
        rating: 4.8,
        description: 'Master modern full-stack web development building real-world projects with Next.js, React, Node.js, and MongoDB. This comprehensive course takes you from basics to advanced concepts, preparing you for a successful career in tech.',
        whatYouWillLearn: [
            'Build responsive and dynamic web applications from scratch.',
            'Master React fundamentals and modern hooks.',
            'Develop powerful server-side rendered apps with Next.js 14.',
            'Design scalable databases using MongoDB and Mongoose.',
            'Implement secure authentication and authorization systems.',
            'Deploy full-stack applications to cloud platforms.'
        ],
        curriculum: [
            { module: 'Module 1: Introduction to Web Development', lessons: 5, time: '2h 15m' },
            { module: 'Module 2: Master UI/UX with Tailwind CSS', lessons: 8, time: '3h 45m' },
            { module: 'Module 3: React Fundamentals & Advanced Hooks', lessons: 12, time: '6h 30m' },
            { module: 'Module 4: Next.js App Router & Server Actions', lessons: 10, time: '5h 20m' },
            { module: 'Module 5: Backend Integration with Node & MongoDB', lessons: 15, time: '8h 00m' },
            { module: 'Module 6: Capstone Project & Deployment', lessons: 6, time: '14h 10m' }
        ]
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-dark pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative border-b border-white/10 pb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-[120px] pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-dark px-3 py-1 rounded border border-primary/20">{course.trackName}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                <FiStar className="fill-current" /> {course.rating} ({course.studentsCount} students)
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                            {course.title}
                        </h1>

                        <p className="text-gray-400 font-medium text-lg max-w-xl leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <span className="text-white font-black text-xs uppercase tracking-widest">AS</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Created By</p>
                                    <p className="text-sm font-bold text-white">{course.instructor}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                                <FiClock /> {course.duration}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                                <FiBook /> {course.level}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                                <FiAward /> Certificate Included
                            </div>
                        </div>
                    </div>

                    {/* Floating Video/Enrollment Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="glass rounded-[2rem] p-4 border border-white/10 shadow-2xl relative z-10 w-full max-w-md mx-auto">
                            <div className="aspect-video w-full relative rounded-xl overflow-hidden mb-6 group cursor-pointer">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/30">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform group-hover:scale-110 transition-transform">
                                        <FiPlayCircle className="text-4xl text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <span className="text-xs font-black text-white uppercase tracking-widest drop-shadow-md">Preview Course</span>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black text-white">{course.price}</span>
                                </div>

                                <button
                                    onClick={() => router.push(course.price === 'Free' ? '/signup' : '/payment')}
                                    className={`w-full py-4 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 ${course.price === 'Free' ? 'bg-primary hover:bg-primary/90' : 'bg-gradient-to-r from-primary to-accent hover:opacity-90'}`}
                                >
                                    {course.price === 'Free' ? 'Enroll for Free' : 'Buy Now'}
                                </button>

                                <p className="text-center text-[10px] font-bold text-gray-500 mt-4 uppercase tracking-widest flex items-center justify-center gap-1">
                                    <FiShield /> 30-Day Money-Back Guarantee
                                </p>
                            </div>
                        </div>

                        {/* Decorative elements behind card */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>

            {/* Mobile Enrollment Card Banner (Sticky Bottom) - Only visible on small screens */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 bg-dark/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex items-center justify-between">
                <div>
                    <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">Course Price</span>
                    <span className="text-2xl font-black text-white">{course.price}</span>
                </div>
                <button
                    onClick={() => router.push(course.price === 'Free' ? '/signup' : '/payment')}
                    className="py-3 px-8 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20"
                >
                    Enroll Now
                </button>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">

                <div className="lg:col-span-2 space-y-16">
                    {/* What you will learn */}
                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 md:p-12">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
                            What you'll learn
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.whatYouWillLearn.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <FiCheck className="text-primary text-sm" />
                                    </div>
                                    <p className="text-gray-300 font-medium text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Content */}
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
                            Course Content
                        </h2>
                        <div className="space-y-4">
                            {course.curriculum.map((item, idx) => (
                                <div key={idx} className="glass rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-500 group-hover:text-primary transition-colors">
                                            {idx + 1}
                                        </div>
                                        <h4 className="text-white font-bold text-sm md:text-base">{item.module}</h4>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span>{item.lessons} Lessons</span>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar details (Visible mainly on larger screens) */}
                <div className="hidden lg:block space-y-8">
                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Course Includes</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                                <FiPlayCircle className="text-lg text-primary" /> {course.duration} on-demand video
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                                <FiArrowRight className="text-lg text-primary" /> Full lifetime access
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                                <FiArrowRight className="text-lg text-primary" /> Access on mobile and TV
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                                <FiBook className="text-lg text-primary" /> 24 downloadable resources
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                                <FiAward className="text-lg text-primary" /> Certificate of completion
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
