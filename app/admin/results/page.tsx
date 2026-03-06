'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUser, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Result {
    _id: string;
    studentId: { name: string, email: string };
    examId: { title: string };
    score: number;
    status: string;
    completedAt: string;
}

export default function AdminResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/results', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-2">Student Exam Results</h1>
                <p className="text-foreground/40 font-medium text-sm mt-1">Monitor academic performance across all tracks.</p>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-foreground/5">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-6 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Examination</th>
                                <th className="px-8 py-6 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Score</th>
                                <th className="px-8 py-6 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {results.map((res) => (
                                <tr key={res._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4 text-primary font-black border border-primary/20">
                                                {res.studentId?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground uppercase tracking-tighter text-sm">{res.studentId?.name}</p>
                                                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{res.studentId?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-foreground font-bold text-sm">{res.examId?.title}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <span className="text-xl font-black text-foreground mr-1">{res.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {res.status === 'Pass' ? (
                                            <span className="flex items-center w-fit text-[10px] font-black text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-500/20">
                                                <FiCheckCircle className="mr-1.5" /> Passed
                                            </span>
                                        ) : (
                                            <span className="flex items-center w-fit text-[10px] font-black text-red-600 bg-red-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-red-500/20">
                                                <FiXCircle className="mr-1.5" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                                        {new Date(res.completedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && results.length === 0 && (
                        <div className="text-center py-20 text-foreground/20 text-[10px] font-black uppercase tracking-widest">
                            No exam results found in database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
