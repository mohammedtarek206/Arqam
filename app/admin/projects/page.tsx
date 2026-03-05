'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiImage, FiX, FiUser, FiUpload, FiEdit, FiCheck } from 'react-icons/fi';

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    studentName: string;
    demoUrl?: string;
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        studentName: '',
        demoUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            const data = await res.json();
            if (Array.isArray(data)) setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreviewImage(base64);
                setFormData({ ...formData, imageUrl: base64 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = editingProject ? 'PATCH' : 'POST';
            const url = editingProject ? `/api/admin/projects?id=${editingProject._id}` : '/api/admin/projects';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchProjects();
                closeModal();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exhibition piece?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/projects?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            studentName: project.studentName,
            demoUrl: project.demoUrl || ''
        });
        setPreviewImage(project.imageUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({ title: '', description: '', imageUrl: '', studentName: '', demoUrl: '' });
        setPreviewImage('');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Exhibition & Gallery</h1>
                    <p className="text-gray-400">Showcase best work and inspiring projects from your students.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/80 text-white font-black px-6 py-3 rounded-xl flex items-center transition-all shadow-lg"
                >
                    <FiPlus className="mr-2" /> Add Piece
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project._id} className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
                        <div className="relative aspect-video">
                            <img src={project.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="p-3 bg-white/10 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-primary"
                                >
                                    <FiEdit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-3 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 space-y-4 flex-1">
                            <div className="flex items-center text-xs text-primary font-black uppercase tracking-widest">
                                <FiUser className="mr-2" /> {project.studentName}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.description}</p>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
                        <FiImage className="mx-auto text-4xl text-gray-600 mb-4" />
                        <h3 className="text-white font-bold">The gallery is empty</h3>
                        <p className="text-gray-500 text-sm">Add amazing student works to inspire others.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-2xl rounded-[2.5rem] p-10 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-white tracking-tighter">
                                    {editingProject ? 'Edit Piece' : 'Add to Exhibition'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Thumbnail</label>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-40 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                            {previewImage ? (
                                                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiImage className="text-2xl text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-all group">
                                                <FiUpload className="text-gray-500 group-hover:text-primary transition-colors text-xl mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pick from device</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. E-Commerce Dashboard"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Student Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. Ahmed Ali"
                                            value={formData.studentName}
                                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none h-32 resize-none leading-relaxed"
                                        placeholder="Explain what makes this project special..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:shadow-2xl hover:shadow-primary/20 text-white font-black py-5 rounded-2xl text-lg transition-all"
                                >
                                    {loading ? 'Processing...' : (editingProject ? 'UPDATE PIECE' : 'PUBLISH TO GALLERY')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
