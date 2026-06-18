'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiBriefcase, FiMapPin, FiClock, FiDollarSign,
  FiX, FiUpload, FiCheckCircle, FiLoader, FiFilter, FiSend
} from 'react-icons/fi';

interface Job {
  _id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  requirementsEn: string[];
  requirementsAr: string[];
  category: string;
  type: string;
  locationAr: string;
  locationEn: string;
  salary?: string;
  createdAt: string;
}

const GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة',
  'الفيوم','الغربية','الإسماعيلية','المنوفية','المنيا','القليوبية',
  'الوادي الجديد','السويس','أسوان','أسيوط','بني سويف','بورسعيد',
  'دمياط','جنوب سيناء','كفر الشيخ','مطروح','الأقصر','قنا',
  'شمال سيناء','الشرقية','سوهاج',
];

const CATEGORIES = ['all', 'programming', 'graphic', 'languages', 'networks', 'ai', 'business', 'other'];
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Jobs', programming: 'Programming', graphic: 'Graphic Design',
  languages: 'Languages', networks: 'Networks', ai: 'AI & Data', business: 'Business', other: 'Other',
};
const STATUS_COLORS: Record<string, string> = {
  'Full-time': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Part-time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Internship': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Freelance': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

type FormState = {
  fullName: string; phone: string; email: string;
  college: string; studyYear: string; specialization: string;
  governorate: string; notes: string; cvUrl: string;
};

const INITIAL_FORM: FormState = {
  fullName: '', phone: '', email: '', college: '', studyYear: '',
  specialization: '', governorate: 'المنيا', notes: '', cvUrl: '',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    let r = jobs;
    if (search) r = r.filter(j =>
      j.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      j.titleAr.includes(search) ||
      j.descriptionEn.toLowerCase().includes(search.toLowerCase())
    );
    if (catFilter !== 'all') r = r.filter(j => j.category === catFilter);
    setFiltered(r);
  }, [jobs, search, catFilter]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) { const d = await res.json(); setJobs(d); setFiltered(d); }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { showToast('Only PDF and Word files are allowed', 'err'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Max file size is 5MB', 'err'); return; }
    setCvFile(file);
    setCvUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/cv-upload', { method: 'POST', body: fd });
      if (res.ok) { const d = await res.json(); setForm(f => ({ ...f, cvUrl: d.url })); showToast('CV uploaded successfully ✓'); }
      else { showToast('CV upload failed', 'err'); setCvFile(null); }
    } catch { showToast('CV upload error', 'err'); setCvFile(null); }
    finally { setCvUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, jobId: selectedJob._id, jobTitle: selectedJob.titleEn }),
      });
      if (res.ok) {
        setSuccess(true);
        showToast('Application submitted successfully!');
        setTimeout(() => { setSelectedJob(null); setSuccess(false); setForm(INITIAL_FORM); setCvFile(null); }, 2500);
      } else {
        const err = await res.json();
        showToast(err.error || 'Submission failed', 'err');
      }
    } catch { showToast('Network error, please try again', 'err'); }
    finally { setSubmitting(false); }
  };

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputCls = 'w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 text-sm font-medium focus:outline-none focus:border-primary/60 transition-colors';

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[300] px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 ${
              toast.type === 'ok' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'ok' ? <FiCheckCircle /> : <FiX />} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Hero */}
        <div className="text-center mb-14 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <FiBriefcase /> Job Opportunities
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">
            Find Your Dream <span className="text-primary">Career</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-foreground/50 text-lg font-medium max-w-xl mx-auto">
            Browse open positions and apply instantly — no login required.
          </motion.p>
        </div>

        {/* Search + Filter */}
        <div className="glass rounded-[2rem] border border-border p-6 mb-10 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input type="text" placeholder="Search jobs by title or keyword..."
              value={search} onChange={e => setSearch(e.target.value)}
              className={`${inputCls} pl-11`} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  catFilter === c ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-foreground/40 hover:text-primary'}`}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-foreground/40 font-bold text-lg">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((job, i) => (
              <motion.div key={job._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass rounded-[2rem] border border-border p-6 flex flex-col gap-4 hover:border-primary/40 transition-all group">

                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl shrink-0">
                    <FiBriefcase />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1 rounded-lg ${STATUS_COLORS[job.type] || 'bg-foreground/10 text-foreground/60 border-border'}`}>
                    {job.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-foreground font-black text-lg leading-tight">{job.titleEn}</h3>
                  <p className="text-foreground/50 text-sm font-medium mt-1 line-clamp-2">{job.descriptionEn}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-bold text-foreground/50">
                  <span className="flex items-center gap-1.5"><FiMapPin className="text-primary" />{job.locationEn}</span>
                  {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign className="text-primary" />{job.salary}</span>}
                  <span className="flex items-center gap-1.5"><FiClock className="text-primary" />
                    {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {job.requirementsEn?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.requirementsEn.slice(0, 3).map((r, idx) => (
                      <span key={idx} className="px-2 py-1 bg-foreground/5 border border-border rounded-lg text-[10px] font-bold text-foreground/50">{r}</span>
                    ))}
                    {job.requirementsEn.length > 3 && (
                      <span className="px-2 py-1 bg-foreground/5 border border-border rounded-lg text-[10px] font-bold text-foreground/40">+{job.requirementsEn.length - 3} more</span>
                    )}
                  </div>
                )}

                <button onClick={() => { setSelectedJob(job); setSuccess(false); setForm(INITIAL_FORM); setCvFile(null); }}
                  className="mt-auto w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-xl font-black text-xs uppercase tracking-widest transition-all group-hover:shadow-lg group-hover:shadow-primary/20">
                  Apply Now / قدّم الآن
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-background border border-border rounded-[2.5rem] shadow-2xl z-10">

              {/* Modal Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border px-8 py-5 flex items-center justify-between z-10 rounded-t-[2.5rem]">
                <div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tight">{selectedJob.titleEn}</h2>
                  <p className="text-foreground/50 text-xs font-bold mt-0.5">{selectedJob.locationEn} · {selectedJob.type}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                  <FiX size={22} />
                </button>
              </div>

              <div className="p-8">
                {success ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-12 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                      <FiCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">Application Sent!</h3>
                    <p className="text-foreground/50 font-medium">We'll review your application and get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Full Name *</label>
                        <input required value={form.fullName} onChange={f('fullName')} placeholder="Your full name" className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Phone *</label>
                        <input required type="tel" value={form.phone} onChange={f('phone')} placeholder="01X XXXX XXXX" className={inputCls} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Email *</label>
                      <input required type="email" value={form.email} onChange={f('email')} placeholder="your@email.com" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">College / University *</label>
                        <input required value={form.college} onChange={f('college')} placeholder="Faculty / University" className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Study Year *</label>
                        <select required value={form.studyYear} onChange={f('studyYear')} className={inputCls}>
                          <option value="">Select year</option>
                          {['1st Year','2nd Year','3rd Year','4th Year','5th Year','Graduate'].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Specialization *</label>
                        <input required value={form.specialization} onChange={f('specialization')} placeholder="e.g. Computer Science" className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Governorate *</label>
                        <select required value={form.governorate} onChange={f('governorate')} className={inputCls}>
                          {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">CV / Resume (PDF or Word)</label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className={`relative h-24 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all ${
                          cvFile ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                        {cvUploading ? (
                          <><FiLoader className="animate-spin text-primary text-xl" /><span className="text-sm font-bold text-foreground/60">Uploading...</span></>
                        ) : cvFile ? (
                          <><FiCheckCircle className="text-green-500 text-xl" /><span className="text-sm font-bold text-green-400">{cvFile.name}</span></>
                        ) : (
                          <><FiUpload className="text-foreground/30 text-xl" /><span className="text-sm font-bold text-foreground/40">Click to upload CV (max 5MB)</span></>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Notes (Optional)</label>
                      <textarea rows={3} value={form.notes} onChange={f('notes')} placeholder="Any additional information..." className={`${inputCls} resize-none`} />
                    </div>

                    <button type="submit" disabled={submitting || cvUploading}
                      className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-3 transition-all text-sm">
                      {submitting ? <><FiLoader className="animate-spin" /> Submitting...</> : <><FiSend /> Submit Application</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
