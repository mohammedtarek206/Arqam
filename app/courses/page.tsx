'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiSearch, FiLayers, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FILTERS = [
  { id: 'all',         name: 'All Courses' },
  { id: 'programming',name: 'Programming' },
  { id: 'graphic',    name: 'Graphic' },
  { id: 'languages',  name: 'Languages' },
  { id: 'networks',   name: 'Networks' },
  { id: 'ai',         name: 'AI & Data' },
  { id: 'business',   name: 'Business' },
  { id: 'kids',       name: 'Kids' },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-green-500/10 text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-400',
  Advanced:     'bg-red-500/10 text-red-400',
};

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="glass rounded-[2rem] border border-border overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-foreground/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-foreground/10 rounded-full" />
        <div className="h-5 w-full bg-foreground/10 rounded-lg" />
        <div className="h-3 w-3/4 bg-foreground/5 rounded-lg" />
        <div className="h-10 w-full bg-foreground/5 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function PublicCoursesPage() {
  const router = useRouter();
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) setCourses(await res.json());
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolled = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/student/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.courses) setEnrolledIds(data.courses.map((c: any) => c._id));
        }
      } catch { /* silent */ }
    };

    fetchData();
    fetchEnrolled();
  }, []);

  const handleEnroll = async (e: React.MouseEvent, course: any) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    if (course.price > 0 && !course.isFree) {
      router.push(`/courses/${course._id}`);
      return;
    }
    try {
      const res = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: course._id }),
      });
      if (res.ok) router.push('/dashboard');
      else { const d = await res.json(); alert(d.error || 'Enrollment failed'); }
    } catch { alert('Error during enrollment'); }
  };

  const filtered = courses.filter(c => {
    const matchCat = filter === 'all' || c.category === filter ||
      c.track?.title?.toLowerCase().includes(filter);
    const matchQ   = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary/8 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <FiZap /> Course Library
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-none">
            Explore Our <span className="text-primary">Courses</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-foreground/50 font-medium max-w-xl mx-auto">
            Browse professional courses across all disciplines. No registration needed to explore.
          </motion.p>
        </div>

        {/* Search + Filter panel */}
        <div className="glass rounded-[2rem] border border-border p-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search courses by name or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/25 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                  filter === f.id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface border-border text-foreground/40 hover:text-primary hover:border-primary/30'}`}>
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between px-1">
            <p className="text-foreground/40 text-xs font-black uppercase tracking-widest">
              {filtered.length} Course{filtered.length !== 1 ? 's' : ''} Found
            </p>
          </div>
        )}

        {/* Grid: 4 → 2 → 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((course, i) => {
                const id        = course._id || course.id;
                const isEnrolled = enrolledIds.includes(id);
                const isFree    = course.isFree || course.price === 0;

                return (
                  <Link href={`/courses/${id}`} key={id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      className="glass rounded-[2rem] border border-border overflow-hidden group hover:border-primary/40 hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.12)] transition-all flex flex-col h-full cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="w-full h-44 relative overflow-hidden shrink-0 bg-foreground/5">
                        <img
                          src={course.thumbnail || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80`}
                          alt={course.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'; }}
                        />
                        {/* Price badge */}
                        <div className="absolute top-3 right-3 backdrop-blur-md bg-black/50 rounded-xl px-3 py-1.5 border border-white/10">
                          <span className={`text-xs font-black ${isFree ? 'text-green-400' : 'text-white'}`}>
                            {isFree ? 'Free' : `${course.price} EGP`}
                          </span>
                        </div>
                        {/* Level badge */}
                        {course.level && (
                          <div className="absolute top-3 left-3">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${LEVEL_COLORS[course.level] || 'bg-foreground/10 text-foreground/60'}`}>
                              {course.level}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
                      </div>

                      {/* Body */}
                      <div className="p-5 flex-1 flex flex-col gap-3 -mt-2 relative z-10">
                        {/* Category tag */}
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg w-max">
                          {course.category || course.track?.title || 'General'}
                        </span>

                        {/* Title — NO instructor name shown */}
                        <h3 className="text-foreground font-black text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/40 mt-auto pt-3 border-t border-border">
                          <span className="flex items-center gap-1"><FiBook />{course.modulesCount || 0} Modules</span>
                          {course.duration && <span className="flex items-center gap-1"><FiClock />{course.duration}</span>}
                          {course.lecturesCount > 0 && <span className="flex items-center gap-1"><FiLayers />{course.lecturesCount} Lectures</span>}
                        </div>

                        {/* CTA button */}
                        <button
                          onClick={e => {
                            if (isEnrolled) { e.preventDefault(); router.push(`/learn/${id}`); }
                            else handleEnroll(e, course);
                          }}
                          className="w-full py-2.5 bg-foreground/5 hover:bg-primary text-foreground/60 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all border border-border hover:border-primary"
                        >
                          {isEnrolled ? '▶ Go to Course' : isFree ? 'Enroll Free' : 'View Details'}
                        </button>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <p className="text-foreground/40 font-black text-lg">No courses found.</p>
            <button onClick={() => { setFilter('all'); setSearch(''); }}
              className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
