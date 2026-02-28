'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTarget, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';

export default function StudentProgressPage() {
    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <header>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Your Progress</h1>
                <p className="text-gray-400 font-bold mt-1">Detailed statistics on your learning journey.</p>
            </header>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Overall Completion', value: '45%', icon: <FiTarget />, color: 'text-primary' },
                    { label: 'Learning Streak', value: '12 Days', icon: <FiTrendingUp />, color: 'text-green-500' },
                    { label: 'Hours Watched', value: '87h', icon: <FiClock />, color: 'text-accent' },
                    { label: 'Rank', value: 'Top 10%', icon: <FiAward />, color: 'text-yellow-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-4"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shrink-0 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white leading-none">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Activity Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-8 rounded-[2.5rem] border border-white/5 w-full flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Learning Activity</h3>
                        <span className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg text-gray-400 uppercase tracking-widest">This Week</span>
                    </div>

                    <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 justify-between">
                        {[40, 70, 45, 90, 60, 20, 80].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                    className="w-full bg-white/5 hover:bg-primary/50 transition-colors rounded-t-xl shrink-0 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                />
                                <span className="text-[10px] font-bold text-gray-600 uppercase">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Subject Mastery */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-8 rounded-[2.5rem] border border-white/5 w-full"
                >
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Skill Mastery</h3>
                    <div className="space-y-6">
                        {[
                            { skill: 'React.js', progress: 85, color: 'from-blue-500 to-cyan-400' },
                            { skill: 'Node.js', progress: 60, color: 'from-green-500 to-emerald-400' },
                            { skill: 'MongoDB', progress: 40, color: 'from-green-600 to-green-400' },
                            { skill: 'UI/UX Basics', progress: 20, color: 'from-accent to-pink-500' },
                        ].map((skill, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-black uppercase text-gray-400 mb-2">
                                    <span className="text-white">{skill.skill}</span>
                                    <span>{skill.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.progress}%` }}
                                        transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                        className={`h-full bg-gradient-to-r rounded-full ${skill.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
