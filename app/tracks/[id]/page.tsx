'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
    FiMonitor, FiSmartphone, FiShield, FiCpu, FiBriefcase,
    FiArrowRight, FiAward, FiClock, FiBook, FiX, FiCreditCard, FiUpload, FiCheckCircle, FiInfo
} from 'react-icons/fi';
import Link from 'next/link';

export default function TrackDetailPage() {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const trackId = params.id as string;

    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'upload' | 'visa'>('select');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [proofImage, setProofImage] = useState<string>('');
    const [visaData, setVisaData] = useState({ number: '', expiry: '', cvv: '' });
    const [uploading, setUploading] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'pending' | 'enrolled'>('none');

    // Render a specific mock track based on the ID param linked from Navbar
    const getTrackInfo = (id: string) => {
        switch (id) {
            case 'web':
                return {
                    name: 'Web Development', title: 'Master Full Stack Web Development',
                    desc: 'Learn to build modern, scalable web applications from scratch using React, Next.js, Node.js, and MongoDB. Become a certified full-stack engineer ready for the tech industry.',
                    color: 'from-blue-600 to-cyan-400', icon: <FiMonitor />, courses: 8, duration: '6 Months', price: 0
                };
            case 'mobile':
                return {
                    name: 'Mobile Development', title: 'Cross-Platform App Development',
                    desc: 'Master Flutter and Dart to build visually stunning, performant mobile applications for both iOS and Android from a single codebase.',
                    color: 'from-emerald-500 to-teal-400', icon: <FiSmartphone />, courses: 6, duration: '4 Months', price: 0
                };
            case 'cyber':
                return {
                    name: 'Cyber Security', title: 'Advanced Network & Cyber Security',
                    desc: 'Equip yourself with the skills to defend networks, master ethical hacking, and conduct advanced risk assessments to protect digital assets.',
                    color: 'from-accent to-pink-500', icon: <FiShield />, courses: 10, duration: '8 Months', price: 0
                };
            case 'ai':
                return {
                    name: 'Artificial Intelligence', title: 'AI & Machine Learning Engineering',
                    desc: 'Dive into the world of AI. Learn Python, build machine learning models, and understand deep learning concepts for the future of tech.',
                    color: 'from-purple-600 to-indigo-500', icon: <FiCpu />, courses: 7, duration: '5 Months', price: 0
                };
            case 'soft-skills':
                return {
                    name: 'Freelancing & Soft Skills', title: 'Start Your Independent Career',
                    desc: 'Learn how to market your technical skills, acquire clients globally, and maintain standard communication and pricing strategies.',
                    color: 'from-orange-500 to-yellow-400', icon: <FiBriefcase />, courses: 3, duration: '2 Months', price: 0
                };
            default:
                return {
                    name: 'Learning Track', title: 'Accelerate Your Tech Career',
                    desc: 'Join this comprehensive track to build real-world projects and acquire in-demand skills.',
                    color: 'from-primary to-accent', icon: <FiAward />, courses: 5, duration: '3 Months', price: 0
                };
        }
    };

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/tracks/${trackId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTrack({
                        ...data,
                        name: data.title,
                        desc: data.description,
                        courses: data.lessons?.length || 0,
                        color: 'from-primary to-accent',
                        icon: <FiAward />
                    });

                    // Check enrollment if user is logged in
                    if (user) {
                        const paymentsRes = await fetch('/api/payments', {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (paymentsRes.ok) {
                            const payments = await paymentsRes.json();
                            const trackPayment = payments.find((p: any) => p.track._id === trackId);
                            if (trackPayment) {
                                if (trackPayment.status === 'approved') setEnrollmentStatus('enrolled');
                                else if (trackPayment.status === 'pending') setEnrollmentStatus('pending');
                            }
                        }
                    }
                } else {
                    setTrack(getTrackInfo(trackId));
                }
            } catch (err) {
                console.error(err);
                setTrack(getTrackInfo(trackId));
            } finally {
                setLoading(false);
            }
        };

        if (trackId) {
            fetchTrack();
        }
    }, [trackId, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!proofImage) return;
        setUploading(true);
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    trackId,
                    amount: track.price,
                    method: selectedMethod,
                    proofImage
                })
            });

            if (res.ok) {
                setEnrollmentStatus('pending');
                setShowPaymentModal(false);
                setPaymentStep('select');
                setProofImage('');
                setVisaData({ number: '', expiry: '', cvv: '' });
                alert('تم إرسال طلب الدفع بنجاح. بانتظار موافقة الإدارة.');
            } else {
                const error = await res.json();
                alert(error.error || 'فشل إرسال طلب الدفع');
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setUploading(false);
        }
    };

    const handleEnroll = () => {
        if (!user) {
            router.push('/signup');
            return;
        }

        if (track.price && track.price > 0) {
            setShowPaymentModal(true);
        } else {
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-32 pb-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!track) return null;

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl ${track.color} opacity-10 rounded-full blur-[120px] pointer-events-none`} />

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${track.color} flex items-center justify-center text-4xl text-white shadow-2xl shadow-primary/20`}>
                            {track.icon}
                        </div>

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{track.name} Track</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mt-4 uppercase tracking-tighter">
                                {track.title}
                            </h1>
                        </div>

                        <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
                            {track.desc}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                            <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <FiBook className="text-2xl text-primary" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Included</p>
                                    <p className="text-lg font-black text-white">{track.courses} Courses</p>
                                </div>
                            </div>
                            <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <FiClock className="text-2xl text-accent" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimated</p>
                                    <p className="text-lg font-black text-white">{track.duration}</p>
                                </div>
                            </div>
                            {track.price > 0 && (
                                <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <FiCreditCard className="text-2xl text-green-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</p>
                                        <p className="text-lg font-black text-white">{track.price} EGP</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            {enrollmentStatus === 'enrolled' ? (
                                <Link
                                    href={`/tracks/${trackId}/lessons`}
                                    className={`px-8 py-4 bg-gradient-to-r ${track.color} text-white font-black uppercase text-sm rounded-2xl shadow-xl flex items-center gap-2 hover:opacity-90 transition-opacity`}
                                >
                                    <FiCheckCircle /> {lang === 'ar' ? 'ابدأ التعلم الآن' : 'Start Learning Now'} <FiArrowRight className={lang === 'ar' ? 'rotate-180' : ''} />
                                </Link>
                            ) : enrollmentStatus === 'pending' ? (
                                <button disabled className="px-8 py-4 bg-yellow-500/20 text-yellow-400 font-black uppercase text-sm rounded-2xl border border-yellow-500/30 flex items-center gap-2 cursor-default">
                                    <FiInfo /> {lang === 'ar' ? 'بانتظار موافقة الإدارة' : 'Pending Approval'}
                                </button>
                            ) : (
                                <button onClick={handleEnroll} className={`px-8 py-4 bg-gradient-to-r ${track.color} text-white font-black uppercase text-sm rounded-2xl shadow-xl flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                                    {lang === 'ar' ? 'اشترك في التراك' : 'Enroll in Track'} <FiArrowRight className={lang === 'ar' ? 'rotate-180' : ''} />
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Curriculum Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/10 relative"
                    >
                        <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">Track Syllabus</h3>

                        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 rtl:before:right-4 before:w-0.5 before:bg-white/5">
                            {[
                                { step: 1, title: 'Fundamentals & Basics', desc: 'Lay the groundwork and learn the core languages and tools.' },
                                { step: 2, title: 'Intermediate Concepts', desc: 'Dive deeper into frameworks and standard industry practices.' },
                                { step: 3, title: 'Advanced Architecture', desc: 'Master advanced design patterns and performance optimization.' },
                                { step: 4, title: 'Final Capstone Project', desc: 'Build and deploy a comprehensive project to graduate.' },
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex gap-6 group">
                                    <div className="w-8 h-8 rounded-full bg-dark border-2 border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary/20 transition-all">
                                        <span className="text-xs font-black text-white">{item.step}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white leading-none mb-2">{item.title}</h4>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
                            <FiAward className="text-3xl text-yellow-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-sm font-black text-white mb-1">Official Certification</h4>
                                <p className="text-xs text-gray-400 font-bold">Complete all courses and the capstone project to earn your verified industry-recognized certificate.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-lg rounded-3xl p-8 border border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    {paymentStep === 'select' ? (
                                        <><FiCreditCard className="mr-2 text-primary" /> Select Payment Method</>
                                    ) : (
                                        <><FiUpload className="mr-2 text-primary" /> Upload Payment Proof</>
                                    )}
                                </h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>

                            {paymentStep === 'select' ? (
                                <>
                                    <p className="text-gray-400 text-sm mb-6">
                                        To enroll in <span className="font-bold text-white">{track.title}</span>, please select your preferred payment method for the amount of <span className="font-bold text-white">{track.price} EGP</span>.
                                    </p>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => { setSelectedMethod('Vodafone Cash'); setPaymentStep('upload'); }}
                                            className="w-full bg-[#E60000]/10 hover:bg-[#E60000]/20 border border-[#E60000]/30 hover:border-[#E60000] transition-all p-4 rounded-xl flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#E60000] flex items-center justify-center text-white font-black text-xs">VF</div>
                                                <span className="text-white font-medium group-hover:text-[#E60000] transition-colors">Vodafone Cash</span>
                                            </div>
                                            <FiArrowRight className="text-gray-500 group-hover:text-[#E60000] transition-colors opacity-0 group-hover:opacity-100" />
                                        </button>

                                        <button
                                            onClick={() => { setSelectedMethod('InstaPay'); setPaymentStep('upload'); }}
                                            className="w-full bg-[#1A1A8C]/10 hover:bg-[#1A1A8C]/20 border border-[#1A1A8C]/30 hover:border-[#1A1A8C] transition-all p-4 rounded-xl flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#1A1A8C] flex items-center justify-center text-white font-black text-[10px]">InstaPay</div>
                                                <span className="text-white font-medium group-hover:text-[#1A1A8C] transition-colors">InstaPay</span>
                                            </div>
                                            <FiArrowRight className="text-gray-500 group-hover:text-[#1A1A8C] transition-colors opacity-0 group-hover:opacity-100" />
                                        </button>

                                        <button
                                            onClick={() => { setSelectedMethod('Visa'); setPaymentStep('visa'); }}
                                            className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500 transition-all p-4 rounded-xl flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black"><FiCreditCard /></div>
                                                <span className="text-white font-medium group-hover:text-blue-400 transition-colors">Credit / Debit Card (Visa)</span>
                                            </div>
                                            <FiArrowRight className="text-gray-500 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                                        </button>
                                    </div>
                                </>
                            ) : paymentStep === 'visa' ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                                        <h4 className="text-white font-bold mb-2 text-sm">بيانات البطاقة البنكية:</h4>
                                        <p className="text-gray-400 text-xs">برجاء إدخال بيانات الفيزا لإتمام عملية الدفع.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">رقم البطاقة</label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-all font-mono text-center"
                                                value={visaData.number}
                                                onChange={e => setVisaData({ ...visaData, number: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">تاريخ الانتهاء</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-all font-mono text-center"
                                                    value={visaData.expiry}
                                                    onChange={e => setVisaData({ ...visaData, expiry: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-all font-mono text-center"
                                                    value={visaData.cvv}
                                                    onChange={e => setVisaData({ ...visaData, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => setPaymentStep('select')}
                                            className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase text-xs"
                                        >
                                            رجوع
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!visaData.number || !visaData.expiry || !visaData.cvv) {
                                                    alert('يرجى إكمال بيانات الفيزا');
                                                    return;
                                                }
                                                setPaymentStep('upload');
                                            }}
                                            className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all uppercase text-xs"
                                        >
                                            متابعة لرفع الإيصال
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-6 bg-primary/10 border border-primary/30 rounded-2xl space-y-4">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                            <FiInfo className="text-primary" /> Instructions / تعليمات الدفع
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedMethod === 'Vodafone Cash' && (
                                                <div className="text-center py-4 bg-black/40 rounded-xl border border-white/5">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">تحويل فودافون كاش إلى الرقم التالي:</p>
                                                    <p className="text-3xl font-black text-primary tracking-tighter select-all cursor-pointer">01006093939</p>
                                                </div>
                                            )}
                                            {selectedMethod === 'InstaPay' && (
                                                <div className="text-center py-4 bg-black/40 rounded-xl border border-white/5">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">تحويل انستا باي إلى الحساب التالي:</p>
                                                    <p className="text-xl font-black text-primary tracking-tight select-all cursor-pointer">mo.tarek@instapay</p>
                                                </div>
                                            )}
                                            <p className="text-gray-400 text-[10px] font-bold text-center uppercase tracking-widest">
                                                بعد التحويل، يرجى رفع صورة الإيصال أو لقطة الشاشة أدناه
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest">Screenshot / Receipt</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="proof-upload"
                                            />
                                            <label
                                                htmlFor="proof-upload"
                                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer overflow-hidden"
                                            >
                                                {proofImage ? (
                                                    <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <FiUpload className="text-3xl text-gray-500 mb-2 group-hover:text-primary transition-colors" />
                                                        <span className="text-xs text-gray-500 font-bold group-hover:text-gray-300 transition-colors">Click to upload screenshot</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setPaymentStep('select')}
                                            className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase text-xs"
                                        >
                                            رجوع
                                        </button>
                                        <button
                                            onClick={handlePaymentSubmit}
                                            disabled={!proofImage || uploading}
                                            className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all uppercase text-xs"
                                        >
                                            {uploading ? 'جاري الإرسال...' : 'إرسال إثبات الدفع'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500">Secure payments powered by Arqam Academy</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
