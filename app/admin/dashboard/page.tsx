'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FiUsers, FiBook, FiDollarSign, FiTrendingUp,
    FiUserCheck, FiCreditCard, FiBarChart2, FiAward,
    FiActivity, FiArrowUpRight, FiArrowDownRight,
    FiArrowRight, FiStar, FiCheckCircle, FiClock
} from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color, bg, change, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-[4rem] opacity-20 group-hover:opacity-30 transition-opacity`} />
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl`}>
                <Icon />
            </div>
            {change !== undefined && (
                <span className={`text-xs font-black flex items-center gap-1 px-2 py-1 rounded-lg ${change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {change >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Math.abs(change)}%
                </span>
            )}
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
    </motion.div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0, instructors: 0, courses: 0, revenue: 0,
        activeSubscriptions: 0, monthRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [studentsRes, tracksRes] = await Promise.all([
                    fetch('/api/admin/students', { headers }),
                    fetch('/api/tracks'),
                ]);

                const [students, tracks] = await Promise.all([
                    studentsRes.json(),
                    tracksRes.json(),
                ]);

                setStats({
                    students: Array.isArray(students) ? students.length : 0,
                    instructors: 3, // placeholder
                    courses: Array.isArray(tracks) ? tracks.length : 0,
                    revenue: 12840,
                    activeSubscriptions: 48,
                    monthRevenue: 3240,
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const recentActivity = [
        { name: 'Ahmed Mohamed', action: 'enrolled in', item: 'Full Stack Web Dev', time: '2m ago', status: 'success' },
        { name: 'Sara Ahmed', action: 'completed exam in', item: 'UI/UX Fundamentals', time: '15m ago', status: 'success' },
        { name: 'Omar Hassan', action: 'subscribed to', item: 'Pro Plan', time: '1h ago', status: 'info' },
        { name: 'Layla Mostafa', action: 'registered as', item: 'New Student', time: '2h ago', status: 'info' },
        { name: 'Kareem Samir', action: 'requested refund for', item: 'Machine Learning', time: '3h ago', status: 'warning' },
    ];

    const topCourses = [
        { name: 'Full Stack Web Dev', students: 142, revenue: '$6,958', rating: 4.9 },
        { name: 'Machine Learning with Python', students: 98, revenue: '$7,742', rating: 4.8 },
        { name: 'Advanced Ethical Hacking', students: 76, revenue: '$7,524', rating: 4.7 },
        { name: 'Flutter Mobile Dev', students: 64, revenue: '$3,776', rating: 4.6 },
    ];

    const quickLinks = [
        { label: 'Add New Course', href: '/admin/courses-control', icon: FiBook, color: 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10' },
        { label: 'Manage Students', href: '/admin/students', icon: FiUsers, color: 'text-green-400 border-green-400/20 bg-green-400/5 hover:bg-green-400/10' },
        { label: 'View Payments', href: '/admin/payments', icon: FiCreditCard, color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5 hover:bg-yellow-400/10' },
        { label: 'Analytics', href: '/admin/analytics', icon: FiBarChart2, color: 'text-purple-400 border-purple-400/20 bg-purple-400/5 hover:bg-purple-400/10' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Dashboard Overview</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <FiClock className="text-sm" />
                    Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Total Students" value={stats.students} icon={FiUsers} color="text-blue-400" bg="bg-blue-400/10" change={12} delay={0} />
                <StatCard title="Instructors" value={stats.instructors} icon={FiUserCheck} color="text-emerald-400" bg="bg-emerald-400/10" change={5} delay={0.05} />
                <StatCard title="Courses" value={stats.courses} icon={FiBook} color="text-purple-400" bg="bg-purple-400/10" change={8} delay={0.1} />
                <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={FiDollarSign} color="text-yellow-400" bg="bg-yellow-400/10" change={22} delay={0.15} />
                <StatCard title="This Month" value={`$${stats.monthRevenue.toLocaleString()}`} icon={FiTrendingUp} color="text-orange-400" bg="bg-orange-400/10" change={-3} delay={0.2} />
                <StatCard title="Active Subs" value={stats.activeSubscriptions} icon={FiActivity} color="text-primary" bg="bg-primary/10" change={15} delay={0.25} />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 p-4 rounded-2xl border ${link.color} transition-all font-bold text-sm`}
                    >
                        <link.icon className="text-xl shrink-0" />
                        <span className="text-xs uppercase tracking-widest">{link.label}</span>
                        <FiArrowRight className="ml-auto text-sm opacity-50" />
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-2xl border border-white/5 overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Recent Activity</h3>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">Live</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black ${item.status === 'success' ? 'bg-green-400/10 text-green-400' : item.status === 'warning' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-primary/10 text-primary'}`}>
                                    {item.status === 'success' ? <FiCheckCircle /> : item.status === 'warning' ? '!' : <FiActivity />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-bold truncate">
                                        <span className="text-primary">{item.name}</span> {item.action} <span className="text-gray-300">{item.item}</span>
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-2xl border border-white/5 overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Top Courses by Revenue</h3>
                        <Link href="/admin/courses-control" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {topCourses.map((course, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-400 text-xs shrink-0">
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-bold truncate">{course.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[10px] text-gray-500 font-bold">{course.students} students</span>
                                        <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                                            <FiStar className="fill-current text-[8px]" /> {course.rating}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-400 whitespace-nowrap">{course.revenue}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
