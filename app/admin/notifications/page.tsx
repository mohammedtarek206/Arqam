'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBell, FiSend, FiUsers, FiUser, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const mockNotifications = [
    { id: 1, title: 'New student registration', body: 'Ahmed Mohamed just registered as a new student.', type: 'info', time: '5m ago', read: false },
    { id: 2, title: 'Payment received', body: '$49 payment received for Full Stack Web Dev.', type: 'success', time: '1h ago', read: false },
    { id: 3, title: 'Instructor application', body: 'New instructor application from Khaled Hassan awaiting review.', type: 'warning', time: '3h ago', read: true },
    { id: 4, title: 'Exam submission', body: 'Omar Zaid submitted the Advanced Hacking exam.', type: 'info', time: '5h ago', read: true },
];

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [form, setForm] = useState({ title: '', body: '', audience: 'all' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1500));
        setSending(false);
        setSent(true);
        setForm({ title: '', body: '', audience: 'all' });
        setTimeout(() => setSent(false), 3000);
    };

    const getTypeStyle = (type: string) => {
        if (type === 'success') return 'text-green-400 bg-green-400/10';
        if (type === 'warning') return 'text-yellow-400 bg-yellow-400/10';
        return 'text-primary bg-primary/10';
    };

    const getTypeIcon = (type: string) => {
        if (type === 'success') return FiCheckCircle;
        if (type === 'warning') return FiAlertCircle;
        return FiInfo;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Notifications & Announcements</h1>
                <p className="text-gray-400 font-medium text-sm mt-1">Send announcements to students or instructors and view system notifications.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Send Notification */}
                <div className="glass rounded-2xl border border-white/5 p-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <FiBell className="text-primary" /> Send Announcement
                    </h3>
                    <form onSubmit={handleSend} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Audience</label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'all', label: 'Everyone', icon: FiUsers },
                                    { value: 'students', label: 'Students', icon: FiUser },
                                    { value: 'instructors', label: 'Instructors', icon: FiUser },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, audience: opt.value }))}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${form.audience === opt.value ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        <opt.icon className="text-sm" /> {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Title</label>
                            <input
                                required
                                type="text"
                                placeholder="Notification title..."
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Message</label>
                            <textarea
                                required
                                placeholder="Write your announcement here..."
                                value={form.body}
                                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                                rows={4}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 text-sm resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending || sent}
                            className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                            {sent ? <><FiCheckCircle /> Sent Successfully!</> : sending ? 'Sending...' : <><FiSend /> Send to {form.audience === 'all' ? 'Everyone' : form.audience}</>}
                        </button>
                    </form>
                </div>

                {/* Recent Notifications */}
                <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Notifications</h3>
                        <button
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Mark all read
                        </button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {notifications.map((notif, i) => {
                            const Icon = getTypeIcon(notif.type);
                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={`flex items-start gap-4 p-5 hover:bg-white/3 transition-colors ${!notif.read ? 'border-l-2 border-primary' : ''}`}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getTypeStyle(notif.type)}`}>
                                        <Icon className="text-sm" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-black ${!notif.read ? 'text-white' : 'text-gray-400'}`}>{notif.title}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{notif.body}</p>
                                        <span className="text-[10px] text-gray-600 font-bold mt-1 block">{notif.time}</span>
                                    </div>
                                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
