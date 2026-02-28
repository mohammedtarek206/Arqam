'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiPlayCircle, FiFileText, FiCheckCircle,
    FiChevronDown, FiChevronUp, FiAward, FiMenu, FiX
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LearnCoursePage() {
    const { t, lang } = useLanguage();
    const params = useParams();
    const courseId = params.courseId;

    const [activeLesson, setActiveLesson] = useState('l1');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock course curriculum
    const course = {
        title: 'Full Stack Web Development with Next.js',
        modules: [
            {
                id: 'm1',
                title: 'Module 1: Getting Started',
                lessons: [
                    { id: 'l1', title: 'Course Intro & Setup', type: 'video', duration: '12:00', completed: true },
                    { id: 'l2', title: 'Next.js Fundamentals', type: 'video', duration: '25:30', completed: false },
                    { id: 'l3', title: 'React Crash Course', type: 'pdf', duration: '15 pages', completed: false },
                ]
            },
            {
                id: 'm2',
                title: 'Module 2: Advanced Concepts',
                lessons: [
                    { id: 'l4', title: 'Server Components', type: 'video', duration: '18:45', completed: false },
                    { id: 'l5', title: 'Data Fetching', type: 'video', duration: '30:10', completed: false },
                    { id: 'l6', title: 'Module 2 Quiz', type: 'exam', duration: '10 Qs', completed: false },
                ]
            }
        ]
    };

    const currentLessonData = course.modules.flatMap(m => m.lessons).find(l => l.id === activeLesson);

    return (
        <div className="min-h-screen bg-dark flex flex-col font-sans">
            {/* Top Navbar for Learning View (minimal) */}
            <header className="h-20 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-50 sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        <FiArrowLeft className="text-xl" />
                    </Link>
                    <div className="hidden md:block">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Learning</p>
                        <h1 className="text-sm font-black text-white">{course.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-gray-500 uppercase">Progress</span>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '33%' }} />
                        </div>
                        <span className="text-xs font-black text-white">33%</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex lg:hidden items-center justify-center"
                    >
                        {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden lg:h-[calc(100vh-5rem)]">
                {/* Main Content Area (Video/PDF Viewer) */}
                <div className="flex-1 overflow-y-auto bg-black flex flex-col relative w-full relative">

                    {/* Player Container */}
                    <div className="w-full aspect-video bg-[#0a0a0a] border-b border-white/5 relative flex items-center justify-center">
                        {currentLessonData?.type === 'video' ? (
                            <div className="w-full h-full group relative">
                                {/* Pseudo Video Player UI */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
                                    alt="Video Poster"
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <button className="absolute inset-0 m-auto w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center text-3xl hover:scale-110 transition-transform shadow-xl shadow-primary/20 backdrop-blur-md">
                                    <FiPlayCircle />
                                </button>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-1 flex-1 bg-white/20 rounded-full cursor-pointer relative">
                                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '45%' }} />
                                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" style={{ left: '45%' }} />
                                    </div>
                                    <span className="text-xs font-black text-white font-mono">11:15 / {currentLessonData?.duration}</span>
                                </div>
                            </div>
                        ) : currentLessonData?.type === 'pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-4">
                                <FiFileText className="text-6xl text-accent" />
                                <button className="px-6 py-3 bg-accent/20 text-accent font-black rounded-xl uppercase text-xs tracking-widest border border-accent/30 hover:bg-accent/30 transition-all">
                                    Open PDF Viewer
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-4">
                                <FiAward className="text-6xl text-primary" />
                                <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/80 transition-all">
                                    Start Exam
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Lesson Details */}
                    <div className="p-8 max-w-4xl w-full mx-auto space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">{currentLessonData?.title}</h2>
                                <p className="text-gray-400 font-bold">In this lesson, you will learn about the fundamentals of Next.js and how to set up your first project correctly.</p>
                            </div>
                            <button className="hidden sm:flex px-6 py-3 bg-green-500/10 text-green-500 font-black rounded-xl text-xs uppercase tracking-widest border border-green-500/20 items-center gap-2 hover:bg-green-500/20 transition-all shrink-0">
                                <FiCheckCircle className="text-lg" /> Mark Complete
                            </button>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Resources</h3>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-xs font-bold text-gray-300">
                                    <FiFileText className="text-primary" /> Presentation.pdf
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-xs font-bold text-gray-300">
                                    <FiFileText className="text-accent" /> SourceCode.zip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 380, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="h-full bg-dark/80 backdrop-blur-xl border-l border-white/5 flex flex-col shrink-0 absolute lg:relative right-0 z-40 w-[380px] lg:w-auto"
                        >
                            <div className="p-6 border-b border-white/5 bg-black/20">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Course Curriculum</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {course.modules.map((module) => (
                                    <div key={module.id} className="border-b border-white/5">
                                        <button className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors group">
                                            <h4 className="text-sm font-black text-white">{module.title}</h4>
                                            <FiChevronDown className="text-gray-500 group-hover:text-white" />
                                        </button>
                                        <div className="bg-black/40">
                                            {module.lessons.map((lesson) => (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => setActiveLesson(lesson.id)}
                                                    className={`w-full p-4 pl-8 flex items-start gap-4 text-left transition-all ${activeLesson === lesson.id
                                                            ? 'bg-primary/10 border-l-4 border-primary'
                                                            : 'hover:bg-white/5 border-l-4 border-transparent'
                                                        }`}
                                                >
                                                    <div className="mt-0.5">
                                                        {lesson.completed ? (
                                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                                <FiCheckCircle className="text-xs" />
                                                            </div>
                                                        ) : lesson.type === 'video' ? (
                                                            <FiPlayCircle className={`text-xl ${activeLesson === lesson.id ? 'text-primary' : 'text-gray-500'}`} />
                                                        ) : lesson.type === 'pdf' ? (
                                                            <FiFileText className={`text-xl ${activeLesson === lesson.id ? 'text-accent' : 'text-gray-500'}`} />
                                                        ) : (
                                                            <FiAward className={`text-xl ${activeLesson === lesson.id ? 'text-yellow-500' : 'text-gray-500'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className={`text-xs font-black leading-tight ${activeLesson === lesson.id ? 'text-white' : 'text-gray-400'}`}>
                                                            {lesson.title}
                                                        </h5>
                                                        <p className="text-[10px] font-bold text-gray-600 mt-1">{lesson.duration}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
