'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit, FiX, FiUser, FiLinkedin, FiTwitter, FiGithub, FiMail, FiImage, FiUpload } from 'react-icons/fi';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    socials: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        email?: string;
    };
    expertise: string[];
}

export default function AdminTeam() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        socials: {
            linkedin: '',
            twitter: '',
            github: '',
            email: ''
        },
        expertise: ''
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team');
            const data = await res.json();
            if (Array.isArray(data)) setTeam(data);
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
            const method = editingMember ? 'PATCH' : 'POST';
            const url = editingMember ? `/api/team?id=${editingMember._id}` : '/api/team';

            const payload = {
                ...formData,
                expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s !== '')
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchTeam();
                closeModal();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/team?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchTeam();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            imageUrl: member.imageUrl,
            socials: {
                linkedin: member.socials.linkedin || '',
                twitter: member.socials.twitter || '',
                github: member.socials.github || '',
                email: member.socials.email || ''
            },
            expertise: member.expertise.join(', ')
        });
        setPreviewImage(member.imageUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
        setFormData({
            name: '',
            role: '',
            bio: '',
            imageUrl: '',
            socials: {
                linkedin: '',
                twitter: '',
                github: '',
                email: ''
            },
            expertise: ''
        });
        setPreviewImage('');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Our Team</h1>
                    <p className="text-gray-400">Manage instructors and team members profile information.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/80 text-white font-black px-6 py-3 rounded-xl flex items-center transition-all shadow-lg shadow-primary/20"
                >
                    <FiPlus className="mr-2" /> Add Team Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member) => (
                    <div key={member._id} className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20">
                                    <img src={member.imageUrl} className="w-full h-full object-cover" alt={member.name} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark-light rounded-lg flex items-center justify-center border border-white/10 text-primary">
                                    <FiUser />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(member)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                >
                                    <FiEdit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-all"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
                                <p className="text-primary text-xs font-black uppercase tracking-widest">{member.role}</p>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{member.bio}</p>

                            <div className="flex gap-3 pt-2">
                                {member.socials.linkedin && <FiLinkedin className="text-gray-500" />}
                                {member.socials.twitter && <FiTwitter className="text-gray-500" />}
                                {member.socials.github && <FiGithub className="text-gray-500" />}
                                {member.socials.email && <FiMail className="text-gray-500" />}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {member.expertise.slice(0, 3).map((exp, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-300 font-bold">
                                        {exp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {team.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
                        <FiUser className="mx-auto text-4xl text-gray-600 mb-4" />
                        <h3 className="text-white font-bold">No team members yet</h3>
                        <p className="text-gray-500 text-sm">Click "Add Team Member" to start building your team.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-light w-full max-w-2xl rounded-[2.5rem] p-10 border border-white/10 my-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-white tracking-tighter">
                                    {editingMember ? 'Edit Profile' : 'Add Team Member'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-all">
                                            {previewImage ? (
                                                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                    <FiImage className="text-3xl text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-3xl cursor-pointer">
                                            <div className="text-center">
                                                <FiUpload className="mx-auto text-white text-xl mb-1" />
                                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Upload Photo</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Profile Picture</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Position / Role</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. Senior Instructor"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio / About</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none h-24 resize-none text-sm"
                                        placeholder="Brief introduction..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Expertise (Separated by commas)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="Python, AI, Data Science..."
                                        value={formData.expertise}
                                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {['linkedin', 'twitter', 'github', 'email'].map((platform) => (
                                        <div key={platform} className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{platform}</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                placeholder={`Link or Handle`}
                                                value={(formData.socials as any)[platform]}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    socials: { ...formData.socials, [platform]: e.target.value }
                                                })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:shadow-2xl hover:shadow-primary/20 text-white font-black py-5 rounded-2xl text-lg transition-all mt-4"
                                >
                                    {loading ? 'Processing...' : (editingMember ? 'UPDATE PROFILE' : 'SAVE TEAM MEMBER')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
