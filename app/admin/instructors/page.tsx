'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUserCheck, FiUserX, FiEdit2, FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiTrash2 } from 'react-icons/fi';

const mockInstructors = [
    { id: '1', name: 'Ahmed Shendy', email: 'ahmed@arqam.edu', specialty: 'Web Development', status: 'approved', revenueSplit: 70, courses: 3, earnings: 4200 },
    { id: '2', name: 'Sara Hassan', email: 'sara@design.com', specialty: 'UI/UX Design', status: 'approved', revenueSplit: 65, courses: 1, earnings: 1200 },
    { id: '3', name: 'Omar Zaid', email: 'omar@cyber.io', specialty: 'Cyber Security', status: 'approved', revenueSplit: 70, courses: 2, earnings: 3800 },
    { id: '4', name: 'Khaled Hassan', email: 'khaled@dev.com', specialty: 'Mobile Dev', status: 'pending', revenueSplit: 70, courses: 0, earnings: 0 },
    { id: '5', name: 'Mai Sayed', email: 'mai@ai.io', specialty: 'AI & Data Science', status: 'pending', revenueSplit: 70, courses: 0, earnings: 0 },
];

export default function InstructorsManagementPage() {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editSplit, setEditSplit] = useState<{ id: string, value: number } | null>(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/instructors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setInstructors(data);
            }
        } catch (err) {
            console.error('Failed to fetch instructors:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = instructors.filter(i => {
        const matchSearch = !search ||
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            (i.email && i.email.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === 'all' || i.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const approve = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/instructors/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });
            fetchInstructors();
        } catch (err) {
            console.error(err);
        }
    };

    const reject = async (id: string) => {
        if (!confirm('Are you sure you want to reject/delete this instructor?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/instructors/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchInstructors();
        } catch (err) {
            console.error(err);
        }
    };

    const ban = async (id: string, current: string) => {
        const newStatus = current === 'banned' ? 'approved' : 'banned';
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/instructors/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchInstructors();
        } catch (err) {
            console.error(err);
        }
    };

    const saveSplit = () => {
        if (!editSplit) return;
        // Logic for saving split to DB would go here (need API)
        alert('Revenue split update logic to be implemented on backend');
        setEditSplit(null);
    };

    const getStatusStyle = (status: string) => {
        if (status === 'approved') return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (status === 'banned') return 'text-red-400 bg-red-400/10 border-red-400/20';
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Instructors Management</h1>
                <p className="text-gray-400 font-medium text-sm mt-1">Review applications, manage revenue splits, and control instructor access.</p>
            </div>

            {/* Pending Alert */}
            {instructors.some(i => i.status === 'pending') && (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-5 flex items-center gap-4">
                    <FiClock className="text-yellow-400 text-xl shrink-0" />
                    <div>
                        <p className="text-yellow-400 font-black text-sm">Pending Applications</p>
                        <p className="text-yellow-400/70 text-xs font-medium">{instructors.filter(i => i.status === 'pending').length} instructor(s) are awaiting your review and approval.</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'pending', 'approved', 'banned'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{s}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Instructor', 'Joined', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">No instructors found.</td></tr>
                            ) : filtered.map((instructor, i) => (
                                <motion.tr key={instructor._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/3 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-black text-sm shrink-0">
                                                {instructor.name?.charAt(0) || 'I'}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{instructor.name}</p>
                                                <p className="text-gray-500 text-xs">{instructor.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm font-medium whitespace-nowrap">
                                        {instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase border px-2 py-1 rounded-lg ${getStatusStyle(instructor.status)}`}>
                                            {instructor.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            {instructor.status === 'pending' && (
                                                <>
                                                    <button onClick={() => approve(instructor._id)} className="p-1.5 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors" title="Approve"><FiCheckCircle /></button>
                                                    <button onClick={() => reject(instructor._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Reject"><FiXCircle /></button>
                                                </>
                                            )}
                                            {instructor.status !== 'pending' && (
                                                <>
                                                    <button onClick={() => ban(instructor._id, instructor.status)} className={`p-1.5 rounded-lg transition-colors ${instructor.status === 'banned' ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`} title={instructor.status === 'banned' ? 'Unban' : 'Ban'}>
                                                        {instructor.status === 'banned' ? <FiUserCheck /> : <FiUserX />}
                                                    </button>
                                                    <button onClick={() => reject(instructor._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete Account">
                                                        <FiTrash2 className="text-sm" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
