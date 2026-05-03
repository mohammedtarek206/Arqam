'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiClock, FiBook, FiAward, FiStar, FiPlayCircle, FiCheck, FiArrowRight, 
    FiShield, FiX, FiCreditCard, FiUpload, FiCheckCircle, FiInfo, 
    FiUser, FiBriefcase 
} from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'upload' | 'visa'>('select');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [proofImage, setProofImage] = useState<string>('');
    const [visaData, setVisaData] = useState({ number: '', expiry: '', cvv: '' });
    const [uploading, setUploading] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'pending' | 'enrolled'>('none');
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [enquiryFor, setEnquiryFor] = useState<'self' | 'company'>('self');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourse(data);

                    // Check enrollment if user is logged in
                    if (user) {
                        const paymentsRes = await fetch('/api/payments', {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (paymentsRes.ok) {
                            const payments = await paymentsRes.json();
                            const coursePayment = payments.find((p: any) => p.course?._id === courseId);
                            if (coursePayment) {
                                if (coursePayment.status === 'approved') setEnrollmentStatus('enrolled');
                                else if (coursePayment.status === 'pending') setEnrollmentStatus('pending');
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch course:', err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, user]);

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
                    courseId,
                    amount: course.price,
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
                alert(lang === 'ar' ? 'تم إرسال طلب الدفع بنجاح. بانتظار موافقة الإدارة.' : 'Payment submitted successfully. Waiting for admin approval.');
                const langUrl = lang === 'ar' ? '/ar' : '';
                router.push(`${langUrl}/dashboard`);
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to submit payment');
            }
        } catch (err) {
            console.error(err);
            alert(lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting request');
        } finally {
            setUploading(false);
        }
    };

    const handleEnroll = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (course.price && course.price > 0 && !course.isFree) {
            setShowPaymentModal(true);
        } else {
            // Free course logic or auto-enroll API could go here
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 text-center">
                <h1 className="text-foreground text-2xl">Course not found</h1>
                <Link href="/courses" className="text-primary mt-4 inline-block underline">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-20">
            {/* WhatsApp Floating Button */}
            <a 
                href="https://wa.me/201006093939" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            >
                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.893-11.891 3.181 0 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.484 8.402 0 6.556-5.332 11.891-11.893 11.891-2.01 0-3.98-.51-5.715-1.472l-6.281 1.692zm6.014-3.644l.431.256c1.474.873 3.176 1.334 4.921 1.334 5.179 0 9.393-4.213 9.393-9.392 0-2.507-1.01-4.863-2.846-6.7c-1.837-1.836-4.193-2.844-6.547-2.844-5.18 0-9.393 4.213-9.393 9.392 0 1.776.499 3.509 1.442 5.011l.281.446-1.042 3.811 3.86-.102zm11.23-5.263c-.301-.151-1.782-.879-2.058-.979-.275-.1-.476-.151-.675.151-.199.301-.771.979-.945 1.179-.175.2-.351.226-.651.076-.3-.15-1.267-.467-2.413-1.489-.892-.796-1.493-1.78-1.669-2.079-.175-.3-.019-.463.13-.612.134-.134.301-.351.451-.526.15-.175.2-.301.3-.501.1-.2.05-.375-.025-.526-.075-.151-.675-1.628-.925-2.229-.244-.585-.491-.505-.675-.515-.174-.01-.374-.012-.574-.012s-.525.075-.8.376c-.275.301-1.051 1.027-1.051 2.504s1.076 2.904 1.226 3.104c.15.2 2.117 3.232 5.128 4.532.715.31 1.273.495 1.708.634.717.228 1.369.196 1.884.119.573-.085 1.782-.727 2.032-1.429.25-.701.25-1.303.175-1.429-.075-.126-.274-.201-.574-.351z"/>
                </svg>
            </a>

            {/* Header Info Bar */}
            <div className="bg-[#0f172a] border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-8 text-sm font-bold text-slate-400">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-primary" /> 
                        <span>{course.duration || 'Not Specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiBook className="text-primary" /> 
                        <span>{course.modulesCount || '0'} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiAward className="text-primary" /> 
                        <span>{course.level}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-16">
                    {/* Overview */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Course Overview</h2>
                        <div className="relative">
                            <p className={`text-slate-400 leading-relaxed text-lg ${!showFullDesc ? 'line-clamp-4' : ''}`}>
                                {course.description}
                            </p>
                            <button 
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                className="text-primary font-bold mt-4 flex items-center gap-1 hover:underline uppercase text-xs tracking-widest"
                            >
                                {showFullDesc ? 'Show Less' : 'Read More'} 
                                <motion.span animate={{ rotate: showFullDesc ? 180 : 0 }}>
                                    <FiArrowRight />
                                </motion.span>
                            </button>
                        </div>
                    </section>

                    {/* Benefits & Certification Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Course Benefits */}
                        <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 text-white border-b border-white/10 pb-4">Course Benefits</h3>
                            <div className="space-y-4">
                                {(course.benefits && course.benefits.length > 0 ? course.benefits : [
                                    'Job-Ready Skills',
                                    'Cutting-Edge Tools',
                                    'Hands-On Training',
                                    'Industry-Recognized Certificate',
                                    'Top-Rated Expert Instructors',
                                    'Mentorship & Support'
                                ]).map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <FiCheckCircle className="text-primary text-sm" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Certification */}
                        <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 text-white border-b border-white/10 pb-4">Course Certification</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                {course.certificationText || 'This certification showcases key skills, hands-on experience, and industry expertise, recognized globally by professionals and employers.'}
                            </p>
                            <div className="aspect-[1.4/1] bg-slate-800 rounded-xl overflow-hidden relative border border-white/10 group">
                                <img 
                                    src={course.certificationImage || 'https://images.unsplash.com/photo-1606326666490-45757474e788?q=80&w=1000&auto=format&fit=crop'} 
                                    alt="Course Certificate" 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase border border-white/20">Course Certificate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Form */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary/10 overflow-hidden relative">
                            {/* Form Header */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Book Your Seat Now !</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Join Arqam Academy today</p>
                            </div>

                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleEnroll(); }}>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Your Full Name" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-primary transition-colors text-sm font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-primary transition-colors text-sm font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                    <div className="flex gap-2">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 flex items-center gap-2 shrink-0">
                                            <img src="https://flagcdn.com/w20/eg.png" alt="Egypt" className="w-5" />
                                            <span className="text-slate-900 font-bold text-sm">+20</span>
                                        </div>
                                        <input 
                                            type="tel" 
                                            placeholder="100 123 4567" 
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-primary transition-colors text-sm font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enquire for</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setEnquiryFor('self')}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group relative ${enquiryFor === 'self' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50 hover:border-primary/30'}`}
                                        >
                                            <FiUser className={`text-2xl ${enquiryFor === 'self' ? 'text-primary' : 'text-slate-400'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${enquiryFor === 'self' ? 'text-primary' : 'text-slate-400'}`}>My Self</span>
                                            {enquiryFor === 'self' && (
                                                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                    <FiCheck className="text-white text-[10px]" />
                                                </div>
                                            )}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setEnquiryFor('company')}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group relative ${enquiryFor === 'company' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50 hover:border-primary/30'}`}
                                        >
                                            <FiBriefcase className={`text-2xl ${enquiryFor === 'company' ? 'text-primary' : 'text-slate-400'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${enquiryFor === 'company' ? 'text-primary' : 'text-slate-400'}`}>My Company</span>
                                            {enquiryFor === 'company' && (
                                                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                    <FiCheck className="text-white text-[10px]" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-2">
                                    <input type="checkbox" id="privacy" className="mt-1 w-4 h-4 accent-primary" required />
                                    <label htmlFor="privacy" className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-tight">
                                        By providing your contact details, you agree to our <Link href="/privacy" className="text-primary underline">Privacy policy</Link>
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-primary py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-100 transition-all mt-4"
                                >
                                    {enrollmentStatus === 'enrolled' ? 'Already Enrolled' : 'Send'}
                                </button>
                            </form>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FiInfo />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need help?</p>
                                    <p className="text-sm font-bold text-white">Contact Support</p>
                                </div>
                            </div>
                            <FiArrowRight className="text-slate-600" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Existing Payment Modal Logic */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl glass border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden rtl:text-right"
                        >
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                                    {lang === 'ar' ? 'إتمام الاشتراك' : 'Payment Details'}
                                </h3>
                                <p className="text-white/60 font-medium">
                                    {lang === 'ar'
                                        ? `قيمة الاشتراك: ${course.price} ج.م`
                                        : `Course Price: ${course.price} EGP`}
                                </p>
                            </div>

                            {paymentStep === 'select' ? (
                                <div className="grid gap-4">
                                    <button
                                        onClick={() => { setSelectedMethod('Vodafone Cash'); setPaymentStep('upload'); }}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-between group transition-all"
                                    >
                                        <span className="font-bold">Vodafone Cash</span>
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedMethod('InstaPay'); setPaymentStep('upload'); }}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-between group transition-all"
                                    >
                                        <span className="font-bold">InstaPay</span>
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Instructions</p>
                                        <p className="font-bold">
                                            {selectedMethod === 'Vodafone Cash' ? 'حول إلى رقم: 01006093939' : 'حول إلى انستا باي: mo.tarek@instapay'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Upload Receipt Image</label>
                                        <div 
                                            className="h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative"
                                            onClick={() => document.getElementById('receipt-upload')?.click()}
                                        >
                                            {proofImage ? (
                                                <img src={proofImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <FiUpload className="text-2xl text-white/20 mb-2" />
                                                    <span className="text-xs text-white/20 font-bold">Click to upload</span>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            id="receipt-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button
                                        onClick={handlePaymentSubmit}
                                        disabled={!proofImage || uploading}
                                        className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl disabled:opacity-50"
                                    >
                                        {uploading ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
