'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiTrash2, FiDownload, FiFilter, FiCheck,
  FiChevronDown, FiClock, FiX, FiCheckCircle
} from 'react-icons/fi';
import { exportToCSV } from '@/lib/exportUtils';

interface CourseRequest {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  college: string;
  studyYear: string;
  governorate: string;
  notes?: string;
  courseName: string;
  status: 'new' | 'contacted' | 'registered' | 'cancelled';
  createdAt: string;
}

export default function CourseRequestsPage() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [filtered, setFiltered] = useState<CourseRequest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [coursesList, setCoursesList] = useState<string[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = requests;
    
    // Apply search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.fullName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        r.courseName.toLowerCase().includes(q)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      result = result.filter(r => r.courseName === courseFilter);
    }
    
    setFiltered(result);
  }, [requests, search, statusFilter, courseFilter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/training-registrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        setFiltered(data);
        
        // Extract unique course names for filtering
        const uniqueCourses: string[] = Array.from(new Set(data.map((r: CourseRequest) => r.courseName)));
        setCoursesList(uniqueCourses);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/training-registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus as any } : r));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration request?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/training-registrations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert('Failed to delete request');
      }
    } catch (err) {
      console.error('Failed to delete request:', err);
    }
  };

  const handleExport = () => {
    const columns = [
      { header: 'Full Name', key: 'fullName' },
      { header: 'Phone Number', key: 'phone' },
      { header: 'Email', key: 'email' },
      { header: 'College', key: 'college' },
      { header: 'Study Year', key: 'studyYear' },
      { header: 'Governorate', key: 'governorate' },
      { header: 'Course Name', key: 'courseName' },
      { header: 'Status', key: 'status' },
      { header: 'Notes', key: 'notes' },
      { header: 'Registration Date', key: 'createdAt' }
    ];
    exportToCSV(filtered, 'Course_Registrations', columns);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contacted':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'registered':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-foreground/10 text-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New / جديد';
      case 'contacted': return 'Contacted / تم التواصل';
      case 'registered': return 'Registered / تم التسجيل';
      case 'cancelled': return 'Cancelled / ملغي';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Course Registration Requests</h1>
          <p className="text-foreground/40 font-medium text-sm mt-1">Manage offline courses and trainings visitor submissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-foreground/40 uppercase tracking-widest bg-surface border border-border px-4 py-2 rounded-xl">
            Total: <span className="text-primary">{filtered.length}</span>
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-xs font-black text-foreground/40 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <FiDownload /> Export to Excel
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-[2rem] border border-border p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name, phone, email, course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/20 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Course selector */}
          <div className="min-w-[200px]">
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="all">All Courses</option>
              {coursesList.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {['all', 'new', 'contacted', 'registered', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                statusFilter === s
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-foreground/40 hover:text-primary'
              }`}
            >
              {s === 'all' ? 'All Statuses' : getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-[2rem] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/30">
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Visitor Info</th>
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Academic & Location</th>
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Course Requested</th>
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Notes</th>
                  <th className="p-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/65">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-foreground/40 font-bold">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req, i) => (
                    <motion.tr
                      key={req._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-foreground/[0.02] transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h4 className="text-foreground font-black text-sm">{req.fullName}</h4>
                          <div className="text-xs text-foreground/60 font-bold">{req.phone}</div>
                          {req.email && <div className="text-[10px] text-foreground/40 font-medium">{req.email}</div>}
                        </div>
                      </td>

                      {/* College & Governorate */}
                      <td className="p-4 text-xs font-bold text-foreground/60 space-y-1">
                        <div>{req.college} ({req.studyYear})</div>
                        <div className="text-[10px] text-foreground/40 font-black tracking-wider uppercase">Gov: {req.governorate}</div>
                      </td>

                      {/* Course Requested */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-foreground text-xs font-black uppercase">{req.courseName}</span>
                          <div className="text-[10px] text-foreground/40 font-medium">
                            {new Date(req.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <div className="inline-block relative">
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-lg focus:outline-none appearance-none pr-8 cursor-pointer ${getStatusStyle(
                              req.status
                            )}`}
                          >
                            <option value="new">New / جديد</option>
                            <option value="contacted">Contacted / تم التواصل</option>
                            <option value="registered">Registered / تم التسجيل</option>
                            <option value="cancelled">Cancelled / ملغي</option>
                          </select>
                          <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="p-4 text-xs font-bold text-foreground/50 max-w-[200px] truncate" title={req.notes}>
                        {req.notes || <span className="text-foreground/20 italic">No notes</span>}
                      </td>

                      {/* Delete */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 rounded-lg text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Request"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
