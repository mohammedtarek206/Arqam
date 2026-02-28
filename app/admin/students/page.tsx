'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiPlusCircle, FiUserX, FiUserCheck, FiDownload, FiFilter, FiMoreVertical, FiEye, FiDollarSign } from 'react-icons/fi';

interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'active' | 'pending' | 'banned';
    points: number;
    level: number;
    createdAt: string;
}

export default function StudentsManagementPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filtered, setFiltered] = useState<Student[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        let result = students;
        if (search) result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
        if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
        setFiltered(result);
    }, [students, search, statusFilter]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/students', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) {
                setStudents(data);
                setFiltered(data);
            }
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/students/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            setStudents(prev => prev.map(s => s._id === id ? { ...s, status: newStatus as any } : s));
        } catch (err) {
            console.error('Failed to toggle student status:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student account? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (err) { console.error('Failed to delete student:', err); }
    };

    const getStatusStyle = (status: string) => {
        if (status === 'active') return 'bg-green-400/10 text-green-400 border-green-400/20';
        if (status === 'banned') return 'bg-red-400/10 text-red-400 border-red-400/20';
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Students Management</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">View, search, and manage all registered students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        Total: <span className="text-white">{students.length}</span>
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

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
                    {['all', 'active', 'pending', 'banned'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : (
                <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Student</th>
                                    <th className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Email</th>
                                    <th className="p-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                                    <th className="p-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest hidden lg:table-cell">Points</th>
                                    <th className="p-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-500 font-bold">No students found.</td></tr>
                                ) : filtered.map((student, i) => (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/3 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase shrink-0">
                                                    {student.name?.charAt(0) || 'S'}
                                                </div>
                                                <span className="text-white font-bold text-sm">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm font-medium hidden md:table-cell">{student.email}</td>
                                        <td className="p-4 text-gray-500 text-xs font-bold hidden lg:table-cell">
                                            {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-center hidden lg:table-cell">
                                            <span className="text-white font-black text-sm">{student.points || 0}</span>
                                            <span className="text-gray-600 text-xs ml-1">pts</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1 rounded-lg ${getStatusStyle(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusToggle(student._id, student.status)}
                                                    title={student.status === 'active' ? 'Ban Student' : 'Activate Student'}
                                                    className={`p-2 rounded-lg transition-colors ${student.status === 'active' ? 'text-red-400 hover:bg-red-400/10' : 'text-green-400 hover:bg-green-400/10'}`}
                                                >
                                                    {student.status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
