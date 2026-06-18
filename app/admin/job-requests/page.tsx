'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTrash2, FiDownload, FiChevronDown, FiFileText, FiExternalLink } from 'react-icons/fi';
import { exportToCSV } from '@/lib/exportUtils';

interface JobRequest {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  college: string;
  studyYear: string;
  specialization: string;
  governorate: string;
  jobTitle: string;
  cvUrl?: string;
  notes?: string;
  status: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-500/10 text-blue-400 border-blue-500/20',
  reviewed:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  interview: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  accepted:  'bg-green-500/10 text-green-400 border-green-500/20',
  rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
  new:       'New / جديد',
  reviewed:  'Reviewed / تمت المراجعة',
  interview: 'Interview / مقابلة',
  accepted:  'Accepted / مقبول',
  rejected:  'Rejected / مرفوض',
};

export default function JobRequestsPage() {
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [filtered, setFiltered] = useState<JobRequest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobsList, setJobsList] = useState<string[]>([]);

  useEffect(() => { fetchRequests(); }, []);

  useEffect(() => {
    let r = requests;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x =>
        x.fullName.toLowerCase().includes(q) || x.phone.includes(q) ||
        x.email.toLowerCase().includes(q) || x.jobTitle.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') r = r.filter(x => x.status === statusFilter);
    if (jobFilter !== 'all') r = r.filter(x => x.jobTitle === jobFilter);
    setFiltered(r);
  }, [requests, search, statusFilter, jobFilter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/job-applications', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        setFiltered(data);
        const uniqueJobs: string[] = Array.from(new Set(data.map((r: JobRequest) => r.jobTitle)));
        setJobsList(uniqueJobs);
      }
    } catch (err) { console.error('Failed to fetch:', err); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/job-applications/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus as any } : r));
    else alert('Failed to update status');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/job-applications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setRequests(prev => prev.filter(r => r._id !== id));
    else alert('Failed to delete');
  };

  const handleExport = () => {
    exportToCSV(filtered, 'Job_Applications', [
      { header: 'Full Name',      key: 'fullName' },
      { header: 'Phone',          key: 'phone' },
      { header: 'Email',          key: 'email' },
      { header: 'College',        key: 'college' },
      { header: 'Study Year',     key: 'studyYear' },
      { header: 'Specialization', key: 'specialization' },
      { header: 'Governorate',    key: 'governorate' },
      { header: 'Job Title',      key: 'jobTitle' },
      { header: 'Status',         key: 'status' },
      { header: 'CV Link',        key: 'cvUrl' },
      { header: 'Notes',          key: 'notes' },
      { header: 'Date',           key: 'createdAt' },
    ]);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Job Applications</h1>
          <p className="text-foreground/40 font-medium text-sm mt-1">Manage all visitor job applications and track their status.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-foreground/40 uppercase tracking-widest bg-surface border border-border px-4 py-2 rounded-xl">
            Total: <span className="text-primary">{filtered.length}</span>
          </span>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-xs font-black text-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">
            <FiDownload /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-[2rem] border border-border p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input type="text" placeholder="Search by name, phone, email, job..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/20 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}
            className="min-w-[180px] px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm font-medium focus:outline-none focus:border-primary/50">
            <option value="all">All Jobs</option>
            {jobsList.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {['all', 'new', 'reviewed', 'interview', 'accepted', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-foreground/40 hover:text-primary'}`}>
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-[2rem] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface/30">
                  {['Applicant', 'Academic Info', 'Job Applied', 'CV', 'Status', 'Actions'].map(h => (
                    <th key={h} className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center text-foreground/40 font-bold">No applications found.</td></tr>
                ) : filtered.map((req, i) => (
                  <motion.tr key={req._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-foreground/[0.02] transition-colors">

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-foreground font-black text-sm">{req.fullName}</p>
                        <p className="text-foreground/60 text-xs font-bold">{req.phone}</p>
                        <p className="text-foreground/40 text-[10px]">{req.email}</p>
                      </div>
                    </td>

                    <td className="p-4 text-xs font-bold text-foreground/60 space-y-0.5">
                      <p>{req.college}</p>
                      <p className="text-foreground/40">{req.studyYear} · {req.specialization}</p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-wider">{req.governorate}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-foreground font-black text-xs uppercase">{req.jobTitle}</p>
                      <p className="text-foreground/30 text-[10px] mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>

                    <td className="p-4">
                      {req.cvUrl ? (
                        <a href={req.cvUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest rounded-lg">
                          <FiFileText /> CV <FiExternalLink />
                        </a>
                      ) : (
                        <span className="text-foreground/20 text-xs italic">None</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="inline-block relative">
                        <select value={req.status} onChange={e => handleStatusChange(req._id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-lg focus:outline-none appearance-none pr-8 cursor-pointer ${STATUS_STYLES[req.status]}`}>
                          {Object.keys(STATUS_LABELS).map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]" />
                      </div>
                    </td>

                    <td className="p-4">
                      <button onClick={() => handleDelete(req._id)}
                        className="p-2 rounded-lg text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
