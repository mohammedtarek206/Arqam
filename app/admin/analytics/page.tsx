'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiAward } from 'react-icons/fi';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [840, 1200, 980, 1600, 1400, 2100, 1800, 2400, 2200, 2800, 3100, 3240];
const enrollmentData = [12, 18, 14, 22, 19, 30, 26, 35, 31, 40, 44, 48];

const maxRevenue = Math.max(...revenueData);
const maxEnroll = Math.max(...enrollmentData);

const BarChart = ({ data, max, color }: { data: number[], max: number, color: string }) => (
    <div className="flex items-end gap-2 h-40">
        {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] text-white font-black opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / max) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className={`w-full rounded-t-md ${color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                />
                <span className="text-[9px] text-gray-600 font-bold">{monthLabels[i]}</span>
            </div>
        ))}
    </div>
);

export default function AdminAnalyticsPage() {
    const topStudents = [
        { name: 'Ahmed Mohamed', points: 1450, courses: 3 },
        { name: 'Sara Hassan', points: 1200, courses: 2 },
        { name: 'Omar Zaid', points: 980, courses: 4 },
        { name: 'Layla Mostafa', points: 840, courses: 2 },
        { name: 'Kareem Samir', points: 720, courses: 1 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Analytics & Reports</h1>
                <p className="text-gray-400 font-medium text-sm mt-1">Deep insights into revenue, enrollments, and student performance.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="glass rounded-2xl border border-white/5 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Monthly Revenue</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">2026 Overview</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-sm font-black bg-green-400/10 px-3 py-2 rounded-xl">
                            <FiTrendingUp /> +22%
                        </div>
                    </div>
                    <BarChart data={revenueData} max={maxRevenue} color="bg-primary" />
                </div>

                {/* Enrollment Chart */}
                <div className="glass rounded-2xl border border-white/5 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Monthly Enrollments</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">2026 Overview</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-black bg-blue-400/10 px-3 py-2 rounded-xl">
                            <FiUsers /> +15%
                        </div>
                    </div>
                    <BarChart data={enrollmentData} max={maxEnroll} color="bg-accent" />
                </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg. Course Completion', value: '68%', icon: FiAward, color: 'text-yellow-400' },
                    { label: 'Avg. Exam Pass Rate', value: '82%', icon: FiBarChart2, color: 'text-green-400' },
                    { label: 'Best Revenue Month', value: 'Feb ($3,240)', icon: FiDollarSign, color: 'text-primary' },
                    { label: 'Peak Enrollment Month', value: 'Feb (48)', icon: FiUsers, color: 'text-purple-400' },
                ].map(stat => (
                    <div key={stat.label} className="glass rounded-2xl p-6 border border-white/5">
                        <stat.icon className={`text-2xl mb-3 ${stat.color}`} />
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xl font-black text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Top Students */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Top Students by Points</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank</th>
                            <th className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Student</th>
                            <th className="p-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Courses</th>
                            <th className="p-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {topStudents.map((s, i) => (
                            <tr key={i} className="hover:bg-white/3 transition-colors">
                                <td className="p-4">
                                    <span className={`font-black text-sm ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                                        #{i + 1}
                                    </span>
                                </td>
                                <td className="p-4 text-white font-bold text-sm">{s.name}</td>
                                <td className="p-4 text-right text-gray-400 font-bold text-sm">{s.courses} courses</td>
                                <td className="p-4 text-right font-black text-white">{s.points} pts</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
