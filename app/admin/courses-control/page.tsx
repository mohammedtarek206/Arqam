'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiPlusCircle, FiPause, FiPlay, FiX, FiSave, FiStar } from 'react-icons/fi';

const initialCourses = [
    { id: 1, title: 'Full Stack Web Development with Next.js', instructor: 'Ahmed Shendy', track: 'Web Development', price: 49, students: 142, status: 'active', rating: 4.9 },
    { id: 2, title: 'UI/UX Design Fundamentals', instructor: 'Sara Hassan', track: 'Design', price: 0, students: 98, status: 'active', rating: 4.7 },
    { id: 3, title: 'Advanced Ethical Hacking', instructor: 'Omar Zaid', track: 'Cyber Security', price: 99, students: 76, status: 'active', rating: 4.8 },
    { id: 4, title: 'Flutter Mobile App Development', instructor: 'Mai Ahmed', track: 'Mobile Dev', price: 59, students: 64, status: 'paused', rating: 4.6 },
    { id: 5, title: 'Machine Learning with Python', instructor: 'Dr. Tarek', track: 'AI & Data', price: 79, students: 98, status: 'active', rating: 4.8 },
];

type Course = typeof initialCourses[0];

function EditModal({ course, onSave, onClose }: { course: Course; onSave: (c: Course) => void; onClose: () => void }) {
    const [form, setForm] = useState({ ...course });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Edit Course</h3>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                        <FiX />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Course Title</label>
                        <input
                            required
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Instructor</label>
                            <input
                                required
                                value={form.instructor}
                                onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Track</label>
                            <select
                                value={form.track}
                                onChange={e => setForm(f => ({ ...f, track: e.target.value }))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                            >
                                {['Web Development', 'Design', 'Cyber Security', 'Mobile Dev', 'AI & Data', 'Soft Skills'].map(t => (
                                    <option key={t} value={t} className="bg-dark">{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Price ($) — set 0 for Free</label>
                            <input
                                type="number"
                                min={0}
                                value={form.price}
                                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                            >
                                <option value="active" className="bg-dark">Active</option>
                                <option value="paused" className="bg-dark">Paused</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function CoursesControlPage() {
    const [courses, setCourses] = useState(initialCourses);
    const [search, setSearch] = useState('');
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const filtered = courses.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()));

    const toggleStatus = (id: number) => setCourses(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
    const deleteCourse = (id: number) => { if (confirm('Delete this course?')) setCourses(prev => prev.filter(c => c.id !== id)); };
    const saveCourse = (updated: Course) => setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {editingCourse && (
                    <EditModal course={editingCourse} onSave={saveCourse} onClose={() => setEditingCourse(null)} />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Courses Control</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Manage all courses, set pricing, and control visibility.</p>
                </div>
                <button className="self-start flex items-center gap-2 px-5 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    <FiPlusCircle /> Add New Course
                </button>
            </div>

            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by course title or instructor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                />
            </div>

            <div className="grid gap-4">
                {filtered.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/20 transition-all"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${course.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                                    {course.status}
                                </span>
                                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{course.track}</span>
                            </div>
                            <h3 className="text-white font-black text-base truncate">{course.title}</h3>
                            <p className="text-gray-500 text-xs font-bold mt-0.5">By {course.instructor}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm shrink-0">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Students</p>
                                <p className="text-white font-black">{course.students}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price</p>
                                <p className="text-yellow-400 font-black">{course.price === 0 ? 'Free' : `$${course.price}`}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rating</p>
                                <p className="text-white font-black flex items-center gap-1"><FiStar className="text-yellow-400 text-xs fill-current" />{course.rating}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                title={course.status === 'active' ? 'Pause' : 'Activate'}
                                onClick={() => toggleStatus(course.id)}
                                className={`p-2 rounded-xl transition-colors ${course.status === 'active' ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-green-400 hover:bg-green-400/10'}`}
                            >
                                {course.status === 'active' ? <FiPause /> : <FiPlay />}
                            </button>
                            <button
                                title="Edit Course"
                                onClick={() => setEditingCourse(course)}
                                className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                            >
                                <FiEdit2 />
                            </button>
                            <button
                                title="Delete Course"
                                onClick={() => deleteCourse(course.id)}
                                className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 font-bold py-12">No courses found.</p>
                )}
            </div>
        </div>
    );
}
