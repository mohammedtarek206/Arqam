'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock, FiBook, FiAward, FiStar, FiCheck, FiArrowRight,
  FiX, FiUpload, FiCheckCircle, FiInfo, FiUser, FiBriefcase,
  FiPlus, FiMinus, FiDownload, FiPlay, FiLayers
} from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import YouTubePlayer from '@/components/YouTubePlayer';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('outline');
  const [enquiryFor, setEnquiryFor] = useState<'self' | 'company'>('self');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'upload'>('select');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'pending' | 'enrolled'>('none');

  // Enquiry form
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          if (user) {
            const pr = await fetch('/api/payments', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (pr.ok) {
              const payments = await pr.json();
              const cp = payments.find((p: any) => p.course?._id === courseId);
              if (cp?.status === 'approved') setEnrollmentStatus('enrolled');
              else if (cp?.status === 'pending') setEnrollmentStatus('pending');
            }
          }
        }
      } catch (err) { console.error('Failed to fetch course:', err); }
      finally { setLoading(false); }
    };
    if (courseId) fetchCourse();
  }, [courseId, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!proofImage) return;
    setUploading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ courseId, amount: course.price, method: selectedMethod, proofImage })
      });
      if (res.ok) {
        setEnrollmentStatus('pending');
        setShowPaymentModal(false);
        router.push('/dashboard');
      } else {
        const err = await res.json();
        alert(err.error || 'Payment failed');
      }
    } catch { alert('Error submitting payment'); }
    finally { setUploading(false); }
  };

  const handleEnroll = () => {
    if (!user) { router.push('/login'); return; }
    if (course.price > 0 && !course.isFree) setShowPaymentModal(true);
    else router.push('/dashboard');
  };

  if (loading) return (
    <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-background pt-32 text-center">
      <h1 className="text-foreground text-2xl">Course not found</h1>
      <Link href="/courses" className="text-primary mt-4 inline-block underline">Back to Courses</Link>
    </div>
  );

  const hasVideo = !!course.introVideo;

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ── HERO SECTION ── */}
      <div className="relative bg-[#020617] pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left: Meta + Media */}
          <div className="lg:col-span-8 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-slate-400">{course.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
              {course.title}
            </h1>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-2"><FiClock className="text-primary" />{course.duration || 'Flexible'}</span>
              <span className="flex items-center gap-2"><FiLayers className="text-primary" />{course.modulesCount || 0} Modules</span>
              <span className="flex items-center gap-2"><FiBook className="text-primary" />{course.lecturesCount || 0} Lectures</span>
              <span className="flex items-center gap-2"><FiAward className="text-primary" />{course.level}</span>
              {course.category && (
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  {course.category}
                </span>
              )}
            </div>

            {/* ── MEDIA: Video OR Image ── */}
            <div className="w-full rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              {hasVideo ? (
                <YouTubePlayer url={course.introVideo} thumbnail={course.thumbnail} title={course.title} />
              ) : course.thumbnail ? (
                <div className="relative w-full aspect-video group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary/20 via-slate-900 to-black flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <FiPlay className="text-primary text-4xl ml-1" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No preview available</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Enroll Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="bg-white rounded-[2rem] p-7 shadow-2xl shadow-primary/10">
                {/* Price */}
                <div className="mb-6">
                  {course.isFree || course.price === 0 ? (
                    <div className="text-3xl font-black text-green-600">Free</div>
                  ) : (
                    <div className="text-3xl font-black text-slate-900">{course.price} <span className="text-base font-bold text-slate-400">EGP</span></div>
                  )}
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEnroll(); }}>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Phone</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="01X XXXX XXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-primary transition-colors" />
                  </div>

                  {/* Enquire for */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {(['self', 'company'] as const).map(opt => (
                      <button key={opt} type="button" onClick={() => setEnquiryFor(opt)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all relative ${enquiryFor === opt ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
                        {opt === 'self' ? <FiUser className={`text-xl ${enquiryFor === opt ? 'text-primary' : 'text-slate-400'}`} />
                          : <FiBriefcase className={`text-xl ${enquiryFor === opt ? 'text-primary' : 'text-slate-400'}`} />}
                        <span className={`text-[9px] font-black uppercase tracking-widest ${enquiryFor === opt ? 'text-primary' : 'text-slate-400'}`}>
                          {opt === 'self' ? 'Myself' : 'Company'}
                        </span>
                        {enquiryFor === opt && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <FiCheck className="text-white text-[9px]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button type="submit"
                    className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-100 transition-all mt-2">
                    {enrollmentStatus === 'enrolled' ? '✓ Already Enrolled' : enrollmentStatus === 'pending' ? '⏳ Pending Approval' : 'Book Your Seat'}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FiInfo />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need help?</p>
                    <a href="https://wa.me/201006093939" target="_blank" rel="noopener noreferrer"
                      className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">
                      WhatsApp Support →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="lg:max-w-[calc(66.666%_-_1.5rem)] space-y-16">

          {/* Overview */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Course Overview</h2>
            <div className="relative">
              <p className={`text-slate-400 leading-relaxed text-lg ${!showFullDesc ? 'line-clamp-4' : ''}`}>
                {course.description}
              </p>
              <button onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-primary font-bold mt-4 flex items-center gap-1 hover:underline uppercase text-xs tracking-widest">
                {showFullDesc ? 'Show Less' : 'Read More'}
                <motion.span animate={{ rotate: showFullDesc ? 90 : 0 }}><FiArrowRight /></motion.span>
              </button>
            </div>
          </section>

          {/* Benefits & Certification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 text-white border-b border-white/10 pb-4">Course Benefits</h3>
              <div className="space-y-3">
                {(course.benefits?.length > 0 ? course.benefits : ['Job-Ready Skills','Cutting-Edge Tools','Hands-On Training','Industry Certificate','Expert Instructors']).map((b: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <FiCheckCircle className="text-primary text-sm" />
                    </div>
                    <span className="text-sm font-bold text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 text-white border-b border-white/10 pb-4">Certification</h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {course.certificationText || 'Earn an industry-recognized certificate upon completing the course.'}
              </p>
              <div className="aspect-[1.4/1] bg-slate-800 rounded-xl overflow-hidden border border-white/10 group">
                <img
                  src={course.certificationImage || 'https://images.unsplash.com/photo-1606326666490-45757474e788?q=80&w=600&auto=format&fit=crop'}
                  alt="Certificate"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="space-y-4">
            {[
              { id: 'outline', title: 'Course Outline', content: course.outline },
              { id: 'learn',   title: 'What You Will Learn', content: course.whatYouWillLearn },
              { id: 'audience',title: 'Audience Profile', content: course.audienceProfile },
            ].map(item => (
              <div key={item.id} className="border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 bg-[#0f172a] hover:bg-white/5 transition-colors text-left">
                  <span className="text-lg font-black uppercase tracking-tighter text-white">{item.title}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-primary">
                    {openAccordion === item.id ? <FiMinus /> : <FiPlus />}
                  </div>
                </button>
                <AnimatePresence>
                  {openAccordion === item.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-8 pt-4 bg-[#0f172a]/50 text-slate-400 leading-relaxed whitespace-pre-line">
                        {item.content || 'Information coming soon...'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Prerequisites */}
          {course.prerequisites && (
            <section className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Prerequisites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.prerequisites.split('\n').filter((l: string) => l.trim()).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 mt-0.5">
                      <FiCheckCircle className="text-primary text-sm" />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/201006093939" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.893-11.891 3.181 0 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.484 8.402 0 6.556-5.332 11.891-11.893 11.891-2.01 0-3.98-.51-5.715-1.472l-6.281 1.692zm6.014-3.644l.431.256c1.474.873 3.176 1.334 4.921 1.334 5.179 0 9.393-4.213 9.393-9.392 0-2.507-1.01-4.863-2.846-6.7-1.837-1.836-4.193-2.844-6.547-2.844-5.18 0-9.393 4.213-9.393 9.392 0 1.776.499 3.509 1.442 5.011l.281.446-1.042 3.811 3.86-.102zm11.23-5.263c-.301-.151-1.782-.879-2.058-.979-.275-.1-.476-.151-.675.151-.199.301-.771.979-.945 1.179-.175.2-.351.226-.651.076-.3-.15-1.267-.467-2.413-1.489-.892-.796-1.493-1.78-1.669-2.079-.175-.3-.019-.463.13-.612.134-.134.301-.351.451-.526.15-.175.2-.301.3-.501.1-.2.05-.375-.025-.526-.075-.151-.675-1.628-.925-2.229-.244-.585-.491-.505-.675-.515-.174-.01-.374-.012-.574-.012s-.525.075-.8.376c-.275.301-1.051 1.027-1.051 2.504s1.076 2.904 1.226 3.104c.15.2 2.117 3.232 5.128 4.532.715.31 1.273.495 1.708.634.717.228 1.369.196 1.884.119.573-.085 1.782-.727 2.032-1.429.25-.701.25-1.303.175-1.429-.075-.126-.274-.201-.574-.351z"/>
        </svg>
      </a>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 z-10">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-5 right-5 text-white/40 hover:text-white">
                <FiX size={22} />
              </button>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Payment</h3>
              <p className="text-slate-400 font-medium mb-8">Course Price: <span className="text-white font-black">{course.price} EGP</span></p>

              {paymentStep === 'select' ? (
                <div className="space-y-4">
                  {['Vodafone Cash', 'InstaPay'].map(method => (
                    <button key={method} onClick={() => { setSelectedMethod(method); setPaymentStep('upload'); }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-between group transition-all">
                      <span className="font-bold">{method}</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Instructions</p>
                    <p className="font-bold text-white">
                      {selectedMethod === 'Vodafone Cash' ? 'حول إلى: 01006093939' : 'حول إلى انستا باي: mo.tarek@instapay'}
                    </p>
                  </div>
                  <div onClick={() => document.getElementById('receipt-upload')?.click()}
                    className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                    {proofImage ? <img src={proofImage} className="w-full h-full object-cover" /> : (
                      <><FiUpload className="text-2xl text-white/20 mb-2" /><span className="text-xs text-white/30 font-bold">Upload receipt</span></>
                    )}
                  </div>
                  <input type="file" id="receipt-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <button onClick={handlePaymentSubmit} disabled={!proofImage || uploading}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl disabled:opacity-50">
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
