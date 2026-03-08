'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiYoutube, FiSettings, FiCheckCircle, FiInfo, FiPlay } from 'react-icons/fi';

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

                {/* Teaser Video Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[2rem] border border-border overflow-hidden"
                >
                    <div className="p-8 border-b border-border bg-foreground/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                            <FiPlay className="text-primary text-xl" />
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Hero Teaser Video</h2>
                        </div>
                        <p className="text-foreground/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                            Attractive looping video shown directly on the Home Page.
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2">Teaser Video URL (Direct / Drive)</label>
                            <input
                                type="text"
                                placeholder="Direct .mp4 link or Google Drive link"
                                value={settings.heroTeaserUrl || ''}
                                onChange={(e) => setSettings({ ...settings, heroTeaserUrl: e.target.value })}
                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                                <p className="text-[10px] font-bold text-primary flex items-center gap-2 mb-1">
                                    <FiInfo /> TIP FOR GOOGLE DRIVE:
                                </p>
                                <p className="text-[9px] text-foreground/60 leading-tight">
                                    Ensure the file is shared as "Anyone with link can view". Use the standard share link; the platform will automatically convert it to a streamable format.
                                </p>
                            </div>
                        </div>

                        {settings.heroTeaserUrl && (
                            <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-border">
                                <video
                                    className="w-full h-full object-cover"
                                    src={settings.heroTeaserUrl.includes('drive.google.com')
                                        ? settings.heroTeaserUrl.replace('/view?usp=sharing', '').replace('/file/d/', '/uc?export=download&id=').replace('?usp=drive_link', '')
                                        : settings.heroTeaserUrl}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            </div>
                        )}

                        <button
                            onClick={() => handleSave('heroTeaserUrl', settings.heroTeaserUrl)}
                            disabled={saving}
                            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {saving ? 'Saving...' : <><FiSave /> Update Teaser Video</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
