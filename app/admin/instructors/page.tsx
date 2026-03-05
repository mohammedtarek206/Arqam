'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUserCheck, FiUserX, FiEdit2, FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiTrash2, FiEye, FiFileText } from 'react-icons/fi';

export default function InstructorsManagementPage() {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);

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
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => setSelectedInstructor(instructor)}
                                                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
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

            {/* Details Modal */}
            <AnimatePresence>
                {selectedInstructor && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedInstructor(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark border border-white/10 rounded-[2.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-black">
                                            {selectedInstructor.name?.charAt(0) || 'I'}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedInstructor.name}</h2>
                                            <p className="text-primary font-bold text-sm tracking-widest uppercase">{selectedInstructor.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedInstructor(null)} className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <FiXCircle size={24} />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Category / Specialty</label>
                                            <p className="text-white font-bold">{selectedInstructor.details?.category || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Phone Number</label>
                                            <p className="text-white font-bold">{selectedInstructor.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Joining Date</label>
                                            <p className="text-white font-bold">{new Date(selectedInstructor.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">CV / Portfolio</label>
                                            {selectedInstructor.details?.cvUrl ? (
                                                <a
                                                    href={selectedInstructor.details.cvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-primary hover:underline font-black text-sm"
                                                >
                                                    <FiFileText /> VIEW RESUME / CV
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 font-bold italic text-sm">No CV uploaded</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Current Status</label>
                                            <span className={`text-[10px] font-black uppercase border px-2 py-1 rounded-lg ${getStatusStyle(selectedInstructor.status)}`}>
                                                {selectedInstructor.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Biography</label>
                                    <p className="text-gray-300 text-sm leading-relaxed overflow-y-auto max-h-40 pr-2">
                                        {selectedInstructor.details?.bio || 'No biography provided.'}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSelectedInstructor(null)}
                                        className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Close
                                    </button>
                                    {selectedInstructor.status === 'pending' && (
                                        <button
                                            onClick={() => { approve(selectedInstructor._id); setSelectedInstructor(null); }}
                                            className="flex-1 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all uppercase tracking-widest text-xs"
                                        >
                                            Approve Instructor
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
