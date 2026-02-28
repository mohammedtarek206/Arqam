'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
    FiArrowLeft, FiPlus, FiTrash2, FiSave,
    FiCheckCircle, FiCircle, FiAlignLeft, FiMoreHorizontal,
    FiClipboard
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
    id: string;
    text: string;
    type: 'mcq' | 'tf' | 'essay';
    options?: string[];
    correctAnswer?: string | number;
    points: number;
}

export default function ExamBuilder({ exam, onCancel }: { exam?: any, onCancel: () => void }) {
    const { t, lang } = useLanguage();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [examInfo, setExamInfo] = useState({
        title: exam?.title || '',
        description: '',
        duration: 30,
        passScore: 50,
    });

    const addQuestion = (type: 'mcq' | 'tf' | 'essay') => {
        const newQuestion: Question = {
            id: Math.random().toString(36).substr(2, 9),
            text: 'New Question Text',
            type,
            points: 1,
            ...(type === 'mcq' ? { options: ['', '', '', ''], correctAnswer: 0 } : {}),
            ...(type === 'tf' ? { options: ['True', 'False'], correctAnswer: 'true' } : {}),
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestionText = (id: string, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
    };

    const updateOption = (qId: string, optIdx: number, val: string) => {
        setQuestions(questions.map(q => {
            if (q.id === qId && q.options) {
                const newOpts = [...q.options];
                newOpts[optIdx] = val;
                return { ...q, options: newOpts };
            }
            return q;
        }));
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-colors">
                    <FiArrowLeft /> {t('manage_exams')}
                </button>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold">
                        Save Draft
                    </button>
                    <button className="px-8 py-3 bg-accent text-white font-black rounded-xl hover:bg-accent/80 transition-all shadow-lg shadow-accent/20 flex items-center gap-2">
                        <FiSave /> Publish Exam
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar: Settings */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-fit">
                        <h3 className="text-xl font-black text-white uppercase mb-8 tracking-tighter shrink-0 flex items-center gap-2">
                            <FiSettingsMini className="text-accent" /> Exam Details
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-widest">Exam Title</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-accent/50"
                                    value={examInfo.title}
                                    onChange={(e) => setExamInfo({ ...examInfo, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-accent uppercase tracking-widest">Duration (m)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-accent/50 text-center"
                                        value={examInfo.duration}
                                        onChange={(e) => setExamInfo({ ...examInfo, duration: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-accent uppercase tracking-widest">Pass Score %</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-accent/50 text-center"
                                        value={examInfo.passScore}
                                        onChange={(e) => setExamInfo({ ...examInfo, passScore: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2.5rem] border border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Exam Summary</h4>
                        <div className="space-y-2 text-sm font-bold">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Questions</span>
                                <span className="text-white">{questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Points</span>
                                <span className="text-white">{questions.reduce((acc, q) => acc + q.points, 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Builder Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => addQuestion('mcq')}
                            className="px-6 py-3 bg-white/3 border border-dashed border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/5 hover:border-accent/30 transition-all text-xs font-black uppercase shrink-0"
                        >
                            <FiCheckCircle className="text-accent" /> + MCQ
                        </button>
                        <button
                            onClick={() => addQuestion('tf')}
                            className="px-6 py-3 bg-white/3 border border-dashed border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/5 hover:border-accent/30 transition-all text-xs font-black uppercase shrink-0"
                        >
                            <FiCircle className="text-accent" /> + True/False
                        </button>
                        <button
                            onClick={() => addQuestion('essay')}
                            className="px-6 py-3 bg-white/3 border border-dashed border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/5 hover:border-accent/30 transition-all text-xs font-black uppercase shrink-0"
                        >
                            <FiAlignLeft className="text-accent" /> + Essay
                        </button>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence>
                            {questions.map((q, idx) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass p-8 rounded-[2.5rem] border border-white/5 relative group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-black uppercase">Q{idx + 1}</span>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{q.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black text-gray-500 uppercase">Points</span>
                                                <input
                                                    type="number"
                                                    className="w-8 bg-transparent border-none text-white text-xs font-black focus:outline-none text-center"
                                                    value={q.points}
                                                    onChange={(e) => setQuestions(questions.map(qu => qu.id === q.id ? { ...qu, points: parseInt(e.target.value) } : qu))}
                                                />
                                            </div>
                                            <button onClick={() => removeQuestion(q.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        className="w-full bg-white/2 border-none text-xl font-black text-white focus:outline-none placeholder:text-gray-700 resize-none mb-6"
                                        placeholder="Type your question here..."
                                        rows={2}
                                        value={q.text}
                                        onChange={(e) => updateQuestionText(q.id, e.target.value)}
                                    />

                                    {q.type === 'mcq' && q.options && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="relative group/opt">
                                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${q.correctAnswer === oIdx ? 'bg-accent border-accent text-white' : 'border-white/10 group-hover/opt:border-white/30'
                                                        }`} onClick={() => setQuestions(questions.map(qu => qu.id === q.id ? { ...qu, correctAnswer: oIdx } : qu))}>
                                                        {q.correctAnswer === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold focus:outline-none focus:border-accent/30"
                                                        placeholder={`Option ${oIdx + 1}`}
                                                        value={opt}
                                                        onChange={(e) => updateOption(q.id, oIdx, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'tf' && (
                                        <div className="flex gap-4">
                                            {['True', 'False'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setQuestions(questions.map(qu => qu.id === q.id ? { ...qu, correctAnswer: opt.toLowerCase() } : qu))}
                                                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border ${q.correctAnswer === opt.toLowerCase()
                                                        ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                                                        : 'bg-white/5 border-white/10 text-gray-500'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'essay' && (
                                        <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] text-center">
                                            <FiAlignLeft className="mx-auto text-4xl text-gray-800 mb-4" />
                                            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Student will see a rich text editor</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {questions.length === 0 && (
                            <div className="text-center py-20 bg-white/2 rounded-[3rem] border-2 border-dashed border-white/5">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiClipboard className="text-4xl text-gray-700" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Your exam is empty</h3>
                                <p className="text-gray-500 font-bold mt-2">Pick a question type from above to start building.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FiSettingsMini({ className }: { className?: string }) {
    return (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
    );
}
