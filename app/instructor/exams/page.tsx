'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiPlus, FiClipboard, FiMoreVertical, FiEdit2,
    FiTrash2, FiEye, FiClock, FiCheckCircle
} from 'react-icons/fi';
import ExamBuilder from '@/components/instructor/ExamBuilder';

export default function ManageExams() {
    const { t, lang } = useLanguage();
    const [showBuilder, setShowBuilder] = useState(false);
    const [selectedExam, setSelectedExam] = useState<any>(null);

    // Mock data for initial UI
    const exams = [
        {
            id: 1,
            title: 'Final Exam - Web Fundamentals',
            course: 'Full Stack Web Development',
            questions: 25,
            duration: 60,
            passScore: 70,
            status: 'active'
        },
        {
            id: 2,
            title: 'Midterm - Cybersecurity Basics',
            course: 'Advanced Ethical Hacking',
            questions: 15,
            duration: 30,
            passScore: 60,
            status: 'draft'
        }
    ];

    const handleCreateNew = () => {
        setSelectedExam(null);
        setShowBuilder(true);
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase">{t('manage_exams')}</h1>
                    <p className="text-gray-400 font-bold mt-1">Create and manage assessments for your students.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="px-8 py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                >
                    <FiPlus className="w-5 h-5" /> {t('create_exam')}
                </button>
            </header>

            {!showBuilder ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl -z-10 group-hover:bg-accent/10 transition-all" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-xl">
                                        <FiClipboard />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">{exam.course}</span>
                                        <h3 className="text-xl font-black text-white leading-tight mt-1">{exam.title}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${exam.status === 'active' ? 'border-green-500/30 text-green-500' : 'border-yellow-500/30 text-yellow-500'
                                        }`}>
                                        {exam.status}
                                    </span>
                                    <button className="text-gray-500 hover:text-white"><FiMoreVertical /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Questions</p>
                                    <p className="text-xl font-black text-white">{exam.questions}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Duration</p>
                                    <p className="text-xl font-black text-white flex items-center justify-center gap-1.5"><FiClock className="text-accent w-4 h-4" /> {exam.duration}m</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Pass Score</p>
                                    <p className="text-xl font-black text-white flex items-center justify-center gap-1.5"><FiCheckCircle className="text-green-500 w-4 h-4" /> {exam.passScore}%</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setSelectedExam(exam); setShowBuilder(true); }}
                                    className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-black uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiEdit2 /> Edit Exam
                                </button>
                                <button className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-black uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <FiEye /> Preview
                                </button>
                                <button className="px-4 py-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <ExamBuilder
                    exam={selectedExam}
                    onCancel={() => setShowBuilder(false)}
                />
            )}
        </div>
    );
}
