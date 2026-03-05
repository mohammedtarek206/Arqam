'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiImage, FiX, FiCheck, FiUpload, FiEdit } from 'react-icons/fi';

interface Partner {
    _id: string;
    name: string;
    logoUrl: string;
}

export default function AdminPartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch('/api/admin/partners');
            const data = await res.json();
            if (Array.isArray(data)) setPartners(data);
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
                setLogoUrl(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = editingPartner ? 'PATCH' : 'POST';
            const url = editingPartner ? `/api/admin/partners?id=${editingPartner._id}` : '/api/admin/partners';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, logoUrl }),
            });

            if (res.ok) {
                fetchPartners();
                closeModal();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this partner?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/partners?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchPartners();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (partner: Partner) => {
        setEditingPartner(partner);
        setName(partner.name);
        setLogoUrl(partner.logoUrl);
        setPreviewImage(partner.logoUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPartner(null);
        setName('');
        setLogoUrl('');
        setPreviewImage('');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Our Partners</h1>
                    <p className="text-gray-400">Manage companies and organizations logos that we collaborate with.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-accent hover:bg-accent/80 text-dark font-black px-6 py-3 rounded-xl flex items-center transition-all shadow-lg"
                >
                    <FiPlus className="mr-2" /> Add Partner
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {partners.map((partner) => (
                    <div key={partner._id} className="glass p-6 rounded-2xl border border-white/5 relative group hover:border-accent/50 transition-all flex flex-col items-center">
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => openEditModal(partner)}
                                className="p-2 bg-dark-light text-white rounded-lg shadow-lg hover:text-accent"
                            >
                                <FiEdit size={12} />
                            </button>
                            <button
                                onClick={() => handleDelete(partner._id)}
                                className="p-2 bg-red-500 text-white rounded-lg shadow-lg"
                            >
                                <FiTrash2 size={12} />
                            </button>
                        </div>
                        <div className="aspect-square w-full bg-white/5 rounded-xl flex items-center justify-center p-4 mb-3">
                            <img src={partner.logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 text-center truncate w-full">{partner.name}</p>
                    </div>
                ))}
                {partners.length === 0 && (
                    <div className="col-span-full py-12 text-center glass rounded-2xl border border-dashed border-white/10">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No partners added yet</p>
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
                            className="bg-dark-light w-full max-w-md rounded-3xl p-8 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {editingPartner ? 'Edit Partner' : 'Add Partner'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Partner Logo</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2 shrink-0">
                                            {previewImage ? (
                                                <img src={previewImage} className="max-w-full max-h-full object-contain" alt="Preview" />
                                            ) : (
                                                <FiImage className="text-2xl text-gray-700" />
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full py-4 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/5 transition-all group">
                                                <FiUpload className="text-gray-500 group-hover:text-accent transition-colors mb-1" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upload Logo</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:border-accent outline-none"
                                        placeholder="e.g. Google"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent hover:shadow-xl hover:shadow-accent/20 text-dark font-black py-4 rounded-xl text-lg transition-all"
                                >
                                    {loading ? 'Adding...' : (editingPartner ? 'UPDATE PARTNER' : 'ADD PARTNER')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
