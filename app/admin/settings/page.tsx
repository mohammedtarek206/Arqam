'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiYoutube, FiSettings, FiCheckCircle, FiInfo } from 'react-icons/fi';

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
            setSettings(data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
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
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Introductory Video</h2>
                        </div>
                        <p className="text-foreground/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                            The video displayed in the platform's Hero section (Home Page).
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2">YouTube URL</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={settings.introVideoUrl || ''}
                                    onChange={(e) => setSettings({ ...settings, introVideoUrl: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/50 transition-all"
                                />
                            </div>
                            <p className="mt-2 text-[10px] text-foreground/40 font-bold uppercase tracking-tight flex items-center gap-1">
                                <FiInfo /> Please use the full watch URL (e.g. youtube.com/watch?v=...)
                            </p>
                        </div>

                        {settings.introVideoUrl && (
                            <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-border relative">
                                <iframe
                                    className="w-full h-full"
                                    src={settings.introVideoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                                    title="Preview"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        <button
                            onClick={() => handleSave('introVideoUrl', settings.introVideoUrl)}
                            disabled={saving}
                            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {saving ? 'Saving...' : <><FiSave /> Update Video URL</>}
                        </button>

                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}
                            >
                                {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
                                {message.text}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* More Settings Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[2rem] border border-border border-dashed p-8 flex flex-col items-center justify-center text-center opacity-40"
                >
                    <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center mb-4">
                        <FiSettings className="text-2xl text-foreground/40" />
                    </div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">More Settings</h3>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tight">Stay tuned for more site configuration options.</p>
                </motion.div>
            </div>
        </div>
    );
}
