'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiYoutube, FiSettings, FiCheckCircle, FiInfo, FiPlay, FiImage, FiPlusCircle, FiTrash2 } from 'react-icons/fi';

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            // Ensure hero_gallery is an array
            if (!data.hero_gallery) data.hero_gallery = [];
            setSettings(data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSaving(true);
        const newAssets = [];
        const token = localStorage.getItem('token');

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const res = await fetch('/api/admin/hero/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                if (res.ok) {
                    const asset = await res.json();
                    newAssets.push(asset);
                }
            }

            if (newAssets.length > 0) {
                const currentGallery = settings.hero_gallery || [];
                const updatedGallery = [...currentGallery, ...newAssets];
                setSettings({ ...settings, hero_gallery: updatedGallery });
                await handleSave('hero_gallery', updatedGallery);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred during upload');
        } finally {
            setSaving(false);
            if (e.target) e.target.value = ''; // Reset input
        }
    };

    const deleteAsset = async (index: number) => {
        const newGallery = settings.hero_gallery.filter((_: any, i: number) => i !== index);
        setSettings({ ...settings, hero_gallery: newGallery });
        await handleSave('hero_gallery', newGallery);
    };

    const handleSave = async (key: string, value: any) => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key, value })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Setting updated successfully!' });
                setSettings({ ...settings, [key]: value });
            } else {
                setMessage({ type: 'error', text: 'Failed to update setting' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
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
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Site Settings</h1>
                <p className="text-foreground/40 font-medium text-sm mt-1">Configure global platform content and dynamic elements.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Intro Video Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2rem] border border-border overflow-hidden"
                >
                    <div className="p-8 border-b border-border bg-foreground/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                            <FiYoutube className="text-red-500 text-xl" />
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Full Intro Video</h2>
                        </div>
                        <p className="text-foreground/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                            The full video opened when clicking the "Watch Video" button.
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2">Full Video URL (YouTube)</label>
                            <input
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={settings.introVideoUrl || ''}
                                onChange={(e) => setSettings({ ...settings, introVideoUrl: e.target.value })}
                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/50 transition-all"
                            />
                        </div>

                        <button
                            onClick={() => handleSave('introVideoUrl', settings.introVideoUrl)}
                            disabled={saving}
                            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : <><FiSave /> Update Full Video URL</>}
                        </button>
                    </div>
                </motion.div>

                {/* Hero Gallery Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[2rem] border border-border overflow-hidden md:col-span-2"
                >
                    <div className="p-8 border-b border-border bg-foreground/[0.02] flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <FiImage className="text-primary text-xl" />
                                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Hero Gallery Assets</h2>
                            </div>
                            <p className="text-foreground/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                                Upload multiple images and videos for the attractive Hero Carousel.
                            </p>
                        </div>
                        <label className="cursor-pointer bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all flex items-center gap-2">
                            <FiPlusCircle /> {saving ? 'Uploading...' : 'Upload Assets'}
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={saving} multiple />
                        </label>
                    </div>

                    <div className="p-8">
                        {(!settings.hero_gallery || settings.hero_gallery.length === 0) ? (
                            <div className="py-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center">
                                <FiImage className="text-4xl text-foreground/10 mb-4" />
                                <p className="text-foreground/40 font-bold text-sm">Your gallery is empty.</p>
                                <p className="text-[10px] text-foreground/20 uppercase font-black mt-1">Upload assets from your device to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {settings.hero_gallery.map((asset: any, index: number) => (
                                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-border bg-surface">
                                        {asset.type === 'video' ? (
                                            <video src={asset.url} className="w-full h-full object-cover" muted />
                                        ) : (
                                            <img src={asset.url} alt="Gallery item" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => deleteAsset(index)}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                title="Delete Asset"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-6 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}
                            >
                                {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
                                {message.text}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
