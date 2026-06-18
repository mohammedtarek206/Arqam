'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiPlusCircle, FiPause, FiPlay, FiX, FiSave, FiLoader, FiVideo, FiImage } from 'react-icons/fi';

interface TrainingCourse {
    _id?: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    category: string;
    duration: string;
    studyMode: string;
    thumbnail?: string;
    introVideo?: string;
    isActive: boolean;
}

function EditModal({
    course,
    onSave,
    onClose
}: {
    course: Partial<TrainingCourse>;
    onSave: (c: any) => Promise<void>;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        titleAr: course.titleAr || '',
        titleEn: course.titleEn || '',
        descriptionAr: course.descriptionAr || '',
        descriptionEn: course.descriptionEn || '',
        category: course.category || 'programming',
        duration: course.duration || '',
        studyMode: course.studyMode || 'Offline',
        thumbnail: course.thumbnail || '',
        introVideo: course.introVideo || '',
        isActive: course?.isActive !== undefined ? course.isActive : true,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } catch (err: any) {
            alert('Failed to save course: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">{course._id ? 'Edit Offline Course' : 'Add Offline Course'}</h3>
                    <button onClick={onClose} className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                        <FiX />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Title (Arabic)</label>
                            <input required value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Title (English)</label>
                            <input required value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Description (Arabic)</label>
                            <textarea required rows={3} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Description (English)</label>
                            <textarea required rows={3} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Category</label>
                            <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors">
                                <option value="programming">Programming</option>
                                <option value="graphic">Graphic Design</option>
                                <option value="languages">Languages</option>
                                <option value="networks">Networks</option>
                                <option value="ai">AI</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Study Mode</label>
                            <select value={form.studyMode} onChange={e => setForm(f => ({ ...f, studyMode: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors">
                                <option value="Offline">Offline</option>
                                <option value="Online">Online</option>
                                <option value="Both">Both (Hybrid)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Duration (e.g. 40 Hours)</label>
                            <input required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-1"><FiImage/> Thumbnail URL</label>
                            <input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-1"><FiVideo/> Intro Video URL (YouTube)</label>
                            <input value={form.introVideo} onChange={e => setForm(f => ({ ...f, introVideo: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary/50" />
                            <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest group-hover:text-foreground transition-colors">Active & Visible to students</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-border rounded-xl text-foreground/40 hover:text-foreground font-black text-xs uppercase tracking-widest transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} {course._id ? 'Save Changes' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function TrainingCoursesControlPage() {
    const [courses, setCourses] = useState<TrainingCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingCourse, setEditingCourse] = useState<Partial<TrainingCourse> | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/training-courses');
            if (res.ok) setCourses(await res.json());
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = courses.filter(c =>
        !search ||
        (c?.titleAr || '').toLowerCase().includes(search.toLowerCase()) ||
        (c?.titleEn || '').toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = async (course: TrainingCourse) => {
        try {
            const res = await fetch(`/api/training-courses/${course._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ isActive: !course.isActive })
            });
            if (res.ok) fetchInitialData();
        } catch (err) { console.error(err); }
    };

    const deleteCourse = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await fetch(`/api/training-courses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) fetchInitialData();
        } catch (err) { console.error(err); }
    };

    const handleSaveCourse = async (formData: any) => {
        const method = editingCourse?._id ? 'PATCH' : 'POST';
        const url = editingCourse?._id ? `/api/training-courses/${editingCourse._id}` : '/api/training-courses';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            fetchInitialData();
        } else {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to save');
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {editingCourse && (
                    <EditModal
                        course={editingCourse}
                        onSave={handleSaveCourse}
                        onClose={() => setEditingCourse(null)}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">الكورسات الاوفلاين</h1>
                    <p className="text-foreground/40 font-medium text-sm mt-1">Manage offline training courses and registrations.</p>
                </div>
                <button
                    onClick={() => setEditingCourse({})}
                    className="self-start flex items-center gap-2 px-5 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <FiPlusCircle /> Add Offline Course
                </button>
            </div>

            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                    type="text"
                    placeholder="Search by course title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/20 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                />
            </div>

            <div className="grid gap-4">
                {filtered.map((course, i) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/20 transition-all"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${course.isActive ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                                    {course?.isActive ? 'Active' : 'Draft/Paused'}
                                </span>
                                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{course.category || 'General'}</span>
                                <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">{course.studyMode}</span>
                            </div>
                            <h3 className="text-white font-black text-base truncate">{course?.titleAr || course?.titleEn || 'Untitled Course'}</h3>
                        </div>
                        <div className="flex items-center gap-6 text-sm shrink-0">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Duration</p>
                                <p className="text-white font-black">{course.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0">
                            <button
                                onClick={() => toggleStatus(course)}
                                className={`p-2.5 rounded-xl transition-all ${course.isActive ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                                title={course.isActive ? "Pause Course" : "Publish Course"}
                            >
                                {course.isActive ? <FiPause /> : <FiPlay />}
                            </button>
                            <button onClick={() => setEditingCourse(course)} className="p-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all">
                                <FiEdit2 />
                            </button>
                            <button onClick={() => deleteCourse(course._id!)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all">
                                <FiTrash2 />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 glass rounded-2xl border border-dashed border-border">
                        <FiSearch className="mx-auto text-3xl text-foreground/20 mb-3" />
                        <p className="text-foreground/40 font-bold text-sm">No courses found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
