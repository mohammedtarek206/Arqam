'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiEdit2, FiTrash2, FiPlusCircle, FiX,
  FiSave, FiLoader, FiPause, FiPlay, FiBriefcase
} from 'react-icons/fi';

interface Job {
  _id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  requirementsAr: string[];
  requirementsEn: string[];
  category: string;
  type: string;
  locationAr: string;
  locationEn: string;
  salary: string;
  isActive: boolean;
}

const CATEGORIES = ['programming', 'graphic', 'languages', 'networks', 'ai', 'business', 'other'];
const TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship'];

function JobModal({
  job,
  onSave,
  onClose,
}: {
  job: Partial<Job>;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    titleAr: job.titleAr || '',
    titleEn: job.titleEn || '',
    descriptionAr: job.descriptionAr || '',
    descriptionEn: job.descriptionEn || '',
    requirementsAr: (job.requirementsAr || []).join('\n'),
    requirementsEn: (job.requirementsEn || []).join('\n'),
    category: job.category || 'programming',
    type: job.type || 'Full-time',
    locationAr: job.locationAr || 'عن بعد',
    locationEn: job.locationEn || 'Remote',
    salary: job.salary || 'Negotiable',
    isActive: job.isActive !== undefined ? job.isActive : true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        requirementsAr: form.requirementsAr.split('\n').filter(r => r.trim()),
        requirementsEn: form.requirementsEn.split('\n').filter(r => r.trim()),
      });
      onClose();
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-surface border border-border rounded-xl p-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors";
  const lbl = "block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">
            {job._id ? 'Edit Job' : 'Add New Job'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Titles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Job Title (Arabic)</label>
              <input required value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} className={inp} placeholder="مطور واجهات أمامية" />
            </div>
            <div>
              <label className={lbl}>Job Title (English)</label>
              <input required value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} className={inp} placeholder="Frontend Developer" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Description (Arabic)</label>
              <textarea required rows={4} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>Description (English)</label>
              <textarea required rows={4} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} className={inp} />
            </div>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Requirements Arabic (one per line)</label>
              <textarea rows={4} value={form.requirementsAr} onChange={e => setForm(f => ({ ...f, requirementsAr: e.target.value }))} className={inp} placeholder="خبرة في React.js&#10;معرفة TypeScript" />
            </div>
            <div>
              <label className={lbl}>Requirements English (one per line)</label>
              <textarea rows={4} value={form.requirementsEn} onChange={e => setForm(f => ({ ...f, requirementsEn: e.target.value }))} className={inp} placeholder="Experience with React.js&#10;TypeScript knowledge" />
            </div>
          </div>

          {/* Meta fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-background">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inp}>
                {TYPES.map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Location (Arabic)</label>
              <input value={form.locationAr} onChange={e => setForm(f => ({ ...f, locationAr: e.target.value }))} className={inp} placeholder="عن بعد / القاهرة" />
            </div>
            <div>
              <label className={lbl}>Location (English)</label>
              <input value={form.locationEn} onChange={e => setForm(f => ({ ...f, locationEn: e.target.value }))} className={inp} placeholder="Remote / Cairo" />
            </div>
          </div>

          <div>
            <label className={lbl}>Salary / Compensation</label>
            <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} className={inp} placeholder="Negotiable / 5000-8000 EGP" />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary/50"
              />
              <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest group-hover:text-foreground transition-colors">Active & Visible on Jobs page</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-border rounded-xl text-foreground/40 hover:text-foreground font-black text-xs uppercase tracking-widest transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
              {job._id ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch all jobs for admin (including inactive)
      const res = await fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setJobs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    const token = localStorage.getItem('token');
    const isEdit = !!editingJob?._id;
    const url = isEdit ? `/api/jobs/${editingJob!._id}` : '/api/jobs';
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save failed');
    }
    fetchJobs();
  };

  const toggleActive = async (job: Job) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/jobs/${job._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !job.isActive }),
    });
    fetchJobs();
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const filtered = jobs.filter(j =>
    !search ||
    j.titleEn.toLowerCase().includes(search.toLowerCase()) ||
    j.titleAr.includes(search)
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {editingJob && (
          <JobModal
            job={editingJob}
            onSave={handleSave}
            onClose={() => setEditingJob(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
            <FiBriefcase className="text-primary" /> Jobs Management
          </h1>
          <p className="text-foreground/40 font-medium text-sm mt-1">Add, edit, and manage job postings visible to visitors.</p>
        </div>
        <button
          onClick={() => setEditingJob({})}
          className="self-start flex items-center gap-2 px-5 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <FiPlusCircle /> Add New Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Search by job title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/20 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {filtered.map((job, i) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/20 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${job.isActive ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                  {job.isActive ? 'Active' : 'Hidden'}
                </span>
                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{job.category}</span>
                <span className="text-[10px] font-black text-foreground/40 uppercase bg-foreground/5 px-2 py-0.5 rounded border border-border">{job.type}</span>
              </div>
              <h3 className="text-white font-black text-base">{job.titleEn}</h3>
              <p className="text-foreground/50 text-xs font-bold mt-0.5 font-arabic" dir="rtl">{job.titleAr}</p>
              <p className="text-foreground/30 text-xs mt-1">{job.locationEn} · {job.salary}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                title={job.isActive ? 'Hide Job' : 'Activate Job'}
                onClick={() => toggleActive(job)}
                className={`p-2 rounded-xl transition-colors ${job.isActive ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-green-400 hover:bg-green-400/10'}`}
              >
                {job.isActive ? <FiPause /> : <FiPlay />}
              </button>
              <button
                title="Edit Job"
                onClick={() => setEditingJob(job)}
                className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                title="Delete Job"
                onClick={() => deleteJob(job._id!)}
                className="p-2 rounded-xl text-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 glass rounded-2xl border-2 border-dashed border-border">
            <FiBriefcase className="mx-auto text-5xl text-foreground/20 mb-4" />
            <p className="text-foreground/40 font-bold">No jobs found. Add your first job posting!</p>
          </div>
        )}
      </div>
    </div>
  );
}
