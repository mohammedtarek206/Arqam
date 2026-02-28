'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiRefreshCw, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface Payment {
    id: string;
    student: string;
    course: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    method: string;
    date: string;
}

// Mock data until real payment API is integrated
const mockPayments: Payment[] = [
    { id: 'TXN-001', student: 'Ahmed Mohamed', course: 'Full Stack Web Dev', amount: 49, status: 'paid', method: 'Card', date: '2026-02-28' },
    { id: 'TXN-002', student: 'Sara Hassan', course: 'UI/UX Fundamentals', amount: 0, status: 'paid', method: 'Free', date: '2026-02-27' },
    { id: 'TXN-003', student: 'Omar Zaid', course: 'Advanced Hacking', amount: 99, status: 'pending', method: 'InstaPay', date: '2026-02-27' },
    { id: 'TXN-004', student: 'Layla Mostafa', course: 'Machine Learning', amount: 79, status: 'paid', method: 'Vodafone Cash', date: '2026-02-26' },
    { id: 'TXN-005', student: 'Kareem Samir', course: 'Machine Learning', amount: 79, status: 'refunded', method: 'Card', date: '2026-02-25' },
    { id: 'TXN-006', student: 'Fatma Ali', course: 'Flutter Dev', amount: 59, status: 'failed', method: 'Fawry', date: '2026-02-25' },
];

export default function PaymentsPage() {
    const [payments] = useState<Payment[]>(mockPayments);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = payments.filter(p => {
        const matchSearch = !search || p.student.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const refunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

    const getStatusIcon = (status: string) => {
        if (status === 'paid') return <FiCheckCircle className="text-green-400" />;
        if (status === 'failed') return <FiXCircle className="text-red-400" />;
        if (status === 'refunded') return <FiRefreshCw className="text-yellow-400" />;
        return <FiClock className="text-gray-400" />;
    };

    const getStatusStyle = (status: string) => {
        if (status === 'paid') return 'bg-green-400/10 text-green-400 border-green-400/20';
        if (status === 'failed') return 'bg-red-400/10 text-red-400 border-red-400/20';
        if (status === 'refunded') return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Payments System</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Track all financial transactions and manage refunds.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest self-start">
                    <FiDownload /> Export Excel
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Revenue', value: `$${totalRevenue}`, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { label: 'Pending', value: `$${pending}`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    { label: 'Refunded', value: `$${refunded}`, color: 'text-red-400', bg: 'bg-red-400/10' },
                ].map(card => (
                    <div key={card.label} className={`glass rounded-2xl p-6 border border-white/5 ${card.bg}`}>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${card.color}`}>{card.label}</p>
                        <span className="text-3xl font-black text-white">{card.value}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by student name or transaction ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'paid', 'pending', 'failed', 'refunded'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Transaction ID', 'Student', 'Course', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map((p, i) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="hover:bg-white/3 transition-colors"
                                >
                                    <td className="p-4 text-xs font-mono text-primary">{p.id}</td>
                                    <td className="p-4 text-white font-bold text-sm whitespace-nowrap">{p.student}</td>
                                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{p.course}</td>
                                    <td className="p-4 text-white font-black">${p.amount}</td>
                                    <td className="p-4 text-gray-500 font-bold text-xs uppercase">{p.method}</td>
                                    <td className="p-4 text-gray-500 font-bold text-xs whitespace-nowrap">{p.date}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase border px-2 py-1 rounded-lg w-max ${getStatusStyle(p.status)}`}>
                                            {getStatusIcon(p.status)} {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {p.status === 'paid' && (
                                            <button className="text-[10px] font-black uppercase tracking-widest text-yellow-400 hover:bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-lg transition-colors">
                                                <FiRefreshCw className="inline mr-1" />Refund
                                            </button>
                                        )}
                                        {p.status === 'pending' && (
                                            <button className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-lg transition-colors">
                                                <FiCheckCircle className="inline mr-1" />Approve
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
