'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
    FiArrowLeft, FiPlus, FiTrash2, FiMove,
    FiVideo, FiFileText, FiChevronDown, FiChevronUp,
    FiSave, FiUpload, FiBook, FiCheckSquare, FiEdit2, FiX, FiClock, FiImage, FiLink
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'pdf' | 'exam';
    file?: File | null;
    fileName?: string;
    videoUrl?: string;
    examQuestions?: number;
    duration?: string;
}

interface Module {
    id: string;
    title: string;
    isOpen: boolean;
    lessons: Lesson[];
}

function LessonRow({ lesson, moduleId, onRemove, onUpdate }: {
    lesson: Lesson; moduleId: string;
    onRemove: (mid: string, lid: string) => void;
    onUpdate: (mid: string, lid: string, data: Partial<Lesson>) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpdate(moduleId, lesson.id, { file, fileName: file.name });
    };
    const iconMap = { video: <FiVideo className="text-blue-400" />, pdf: <FiFileText className="text-orange-400" />, exam: <FiCheckSquare className="text-green-400" /> };
    return (
        <div className="bg-white/5 rounded-xl border border-white/5 group hover:border-white/15 transition-all p-3">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="text-lg shrink-0">{iconMap[lesson.type]}</div>
                <input value={lesson.title} onChange={e => onUpdate(moduleId, lesson.id, { title: e.target.value })}
                    className="flex-1 bg-transparent border-none text-sm font-bold text-white focus:outline-none min-w-[120px]"
                    placeholder="Lesson title..." />
                {lesson.type === 'video' && (
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <FiVideo className="text-blue-400 shrink-0" />
                        <input value={lesson.videoUrl || ''} onChange={e => onUpdate(moduleId, lesson.id, { videoUrl: e.target.value })}
                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:border-primary/50"
                            placeholder="YouTube URL..." />
                        <input value={lesson.duration || ''} onChange={e => onUpdate(moduleId, lesson.id, { duration: e.target.value })}
                            className="w-14 bg-black/30 border border-white/10 rounded-lg p-1 text-white text-[10px] font-black text-center focus:outline-none"
                            placeholder="0:00" />
                    </div>
                )}
                {lesson.type === 'pdf' && (
                    <>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={handleFileChange} />
                        <button onClick={() => fileRef.current?.click()}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${lesson.fileName ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-gray-500 hover:text-white border border-white/10'}`}>
                            <FiUpload className="text-xs" />
                            {lesson.fileName ? lesson.fileName.slice(0, 14) + '…' : 'Upload PDF'}
                        </button>
                    </>
                )}
                {lesson.type === 'exam' && (
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-500 font-bold">Questions:</span>
                        <input type="number" min={1} value={lesson.examQuestions || 10}
                            onChange={e => onUpdate(moduleId, lesson.id, { examQuestions: Number(e.target.value) })}
                            className="w-14 bg-black/30 border border-white/10 rounded-lg p-1 text-white text-xs font-black text-center focus:outline-none" />
                    </div>
                )}
                <button onClick={() => onRemove(moduleId, lesson.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0">
                    <FiX className="text-sm" />
                </button>
            </div>
        </div>
    );
}

export default function CourseBuilder({ course, onCancel }: { course?: any; onCancel: () => void }) {
    const { t } = useLanguage();
    const [modules, setModules] = useState<Module[]>([]);
    const [saved, setSaved] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [courseInfo, setCourseInfo] = useState({
        title: course?.title || '',
        description: course?.description || '',
        category: course?.category || '',
        level: course?.level || 'Beginner',
        duration: course?.duration || '',
        price: course?.price || 0,
        isFree: course?.isFree ?? true,
        thumbnail: '',
        thumbnailPreview: course?.thumbnail || '',
        introVideo: course?.introVideo || '',
        benefits: (course?.benefits || []).join('\n'),
        outline: course?.outline || '',
        whatYouWillLearn: course?.whatYouWillLearn || '',
        prerequisites: course?.prerequisites || '',
    });
    const thumbRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (course?._id) fetchCourseDetails();
    }, [course?._id]);

    const fetchCourseDetails = async () => {
        setFetching(true);
        try {
            const res = await fetch(`/api/instructor/courses/${course._id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCourseInfo({
                    title: data.title || '',
                    description: data.description || '',
                    category: data.category || '',
                    level: data.level || 'Beginner',
                    duration: data.duration || '',
                    price: data.price || 0,
                    isFree: data.isFree ?? true,
                    thumbnail: '',
                    thumbnailPreview: data.thumbnail || '',
                    introVideo: data.introVideo || '',
                    benefits: (data.benefits || []).join('\n'),
                    outline: data.outline || '',
                    whatYouWillLearn: data.whatYouWillLearn || '',
                    prerequisites: data.prerequisites || '',
                });
                if (data.modules) {
                    setModules(data.modules.map((m: any) => ({
                        id: m._id, title: m.title, isOpen: false, lessons: m.lessons || []
                    })));
                }
            }
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    };

    const addModule = () => setModules(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), title: `Module ${prev.length + 1}`, isOpen: true, lessons: [] }]);
    const toggleModule = (id: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, isOpen: !m.isOpen } : m));
    const removeModule = (id: string) => setModules(prev => prev.filter(m => m.id !== id));
    const addLesson = (moduleId: string, type: Lesson['type']) => {
        const labels = { video: 'New Video Lesson', pdf: 'New Document', exam: 'New Exam' };
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, { id: Math.random().toString(36).substr(2, 9), title: labels[type], type, examQuestions: type === 'exam' ? 10 : undefined }] } : m));
    };
    const removeLesson = (moduleId: string, lessonId: string) => setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m));
    const updateLesson = (moduleId: string, lessonId: string, data: Partial<Lesson>) => setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...data } : l) } : m));
    const updateModuleTitle = (moduleId: string, title: string) => setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m));

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setCourseInfo(prev => ({ ...prev, thumbnailPreview: URL.createObjectURL(file) }));
    };

    const handleSave = async () => {
        if (!courseInfo.title.trim()) { alert('Please provide a course title.'); return; }
        try {
            const method = course?._id ? 'PATCH' : 'POST';
            const url = course?._id ? `/api/instructor/courses/${course._id}` : '/api/instructor/courses';
            const payload = {
                title: courseInfo.title,
                description: courseInfo.description,
                category: courseInfo.category,
                level: courseInfo.level,
                duration: courseInfo.duration,
                price: courseInfo.isFree ? 0 : Number(courseInfo.price),
                isFree: courseInfo.isFree,
                thumbnail: courseInfo.thumbnailPreview,
                introVideo: courseInfo.introVideo,
                benefits: courseInfo.benefits.split('\n').filter(b => b.trim()),
                outline: courseInfo.outline,
                whatYouWillLearn: courseInfo.whatYouWillLearn,
                prerequisites: courseInfo.prerequisites,
                isActive: true,
                modules: modules.map(m => ({
                    title: m.title,
                    lessons: m.lessons.map(l => ({ title: l.title, type: l.type, contentUrl: l.type === 'video' ? l.videoUrl : l.fileName, examQuestions: l.examQuestions, duration: l.duration }))
                }))
            };
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => { setSaved(false); onCancel(); }, 1500);
            } else {
                const err = await res.json();
                alert(`Failed to save: ${err.error || 'Unknown error'}`);
            }
        } catch (err) { alert('An error occurred while saving.'); }
    };

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

    if (fetching) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-colors">
                    <FiArrowLeft /> Back to Courses
                </button>
                <button onClick={handleSave}
                    className={`px-6 py-3 font-black rounded-xl text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'}`}>
                    <FiSave /> {saved ? 'Saved!' : (course ? 'Save Changes' : 'Publish Course')}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT: Curriculum */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Curriculum Builder</h2>
                        <button onClick={addModule} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all font-black text-xs uppercase tracking-widest">
                            <FiPlus /> Add Module
                        </button>
                    </div>
                    <div className="space-y-4">
                        {modules.map((mod, index) => (
                            <div key={mod.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
                                <div className="p-4 bg-white/5 flex items-center justify-between cursor-pointer" onClick={() => toggleModule(mod.id)}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FiMove className="text-gray-600 cursor-move shrink-0" />
                                        <span className="text-[10px] font-black text-primary uppercase shrink-0">Module {index + 1}</span>
                                        <input value={mod.title} onChange={e => { e.stopPropagation(); updateModuleTitle(mod.id, e.target.value); }} onClick={e => e.stopPropagation()}
                                            className="bg-transparent border-none text-white font-black focus:outline-none flex-1 min-w-0 text-sm" />
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] text-gray-500 font-bold">{mod.lessons.length} lessons</span>
                                        <button onClick={e => { e.stopPropagation(); removeModule(mod.id); }} className="text-gray-500 hover:text-red-500 p-1 rounded transition-colors"><FiTrash2 className="text-sm" /></button>
                                        {mod.isOpen ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {mod.isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-4 space-y-2">
                                                {mod.lessons.map(lesson => (
                                                    <LessonRow key={lesson.id} lesson={lesson} moduleId={mod.id} onRemove={removeLesson} onUpdate={updateLesson} />
                                                ))}
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => addLesson(mod.id, 'video')} className="flex-1 py-3 border border-dashed border-blue-500/30 rounded-xl text-[10px] font-black uppercase text-blue-400/70 hover:text-blue-400 hover:border-blue-500/60 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-1.5"><FiVideo /> + Video</button>
                                                    <button onClick={() => addLesson(mod.id, 'pdf')} className="flex-1 py-3 border border-dashed border-orange-500/30 rounded-xl text-[10px] font-black uppercase text-orange-400/70 hover:text-orange-400 hover:border-orange-500/60 hover:bg-orange-500/5 transition-all flex items-center justify-center gap-1.5"><FiFileText /> + Document</button>
                                                    <button onClick={() => addLesson(mod.id, 'exam')} className="flex-1 py-3 border border-dashed border-green-500/30 rounded-xl text-[10px] font-black uppercase text-green-400/70 hover:text-green-400 hover:border-green-500/60 hover:bg-green-500/5 transition-all flex items-center justify-center gap-1.5"><FiCheckSquare /> + Exam</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        {modules.length === 0 && (
                            <div className="text-center py-20 bg-white/3 rounded-3xl border-2 border-dashed border-white/10">
                                <FiBook className="mx-auto text-4xl text-gray-700 mb-4" />
                                <p className="text-gray-500 font-bold mb-3">Your curriculum is empty.</p>
                                <button onClick={addModule} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all">+ Add First Module</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Settings */}
                <div className="space-y-5">
                    {/* Course Details */}
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-base font-black text-white uppercase tracking-tight">Course Details</h3>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Course Title *</label>
                            <input value={courseInfo.title} onChange={e => setCourseInfo(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g. Master React in 30 Days"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                            <textarea value={courseInfo.description} onChange={e => setCourseInfo(p => ({ ...p, description: e.target.value }))}
                                placeholder="What students will learn..."
                                rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                <input value={courseInfo.category} onChange={e => setCourseInfo(p => ({ ...p, category: e.target.value }))}
                                    placeholder="e.g. Programming"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Level</label>
                                <select value={courseInfo.level} onChange={e => setCourseInfo(p => ({ ...p, level: e.target.value }))}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l} className="bg-dark">{l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Duration</label>
                                <input value={courseInfo.duration} onChange={e => setCourseInfo(p => ({ ...p, duration: e.target.value }))}
                                    placeholder="e.g. 24 hours"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Price (EGP)</label>
                                <input type="number" value={courseInfo.isFree ? 0 : courseInfo.price} disabled={courseInfo.isFree}
                                    onChange={e => setCourseInfo(p => ({ ...p, price: Number(e.target.value) }))}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-40" />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={courseInfo.isFree} onChange={e => setCourseInfo(p => ({ ...p, isFree: e.target.checked }))} className="w-4 h-4 accent-primary" />
                            <span className="text-sm font-bold text-gray-400">Free Course</span>
                        </label>
                    </div>

                    {/* Media */}
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2"><FiImage /> Media</h3>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Thumbnail Image</label>
                            <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                            {courseInfo.thumbnailPreview ? (
                                <div className="relative rounded-xl overflow-hidden h-32 group cursor-pointer" onClick={() => thumbRef.current?.click()}>
                                    <img src={courseInfo.thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><FiEdit2 /> Change</span>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => thumbRef.current?.click()}
                                    className="w-full h-28 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer gap-2">
                                    <FiUpload className="text-2xl text-gray-600" />
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Upload Thumbnail</span>
                                </button>
                            )}
                        </div>

                        {/* Intro Video URL */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><FiLink /> Intro Video URL (YouTube)</label>
                            <input value={courseInfo.introVideo} onChange={e => setCourseInfo(p => ({ ...p, introVideo: e.target.value }))}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-base font-black text-white uppercase tracking-tight">Additional Details</h3>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Benefits (one per line)</label>
                            <textarea value={courseInfo.benefits} onChange={e => setCourseInfo(p => ({ ...p, benefits: e.target.value }))}
                                placeholder="Job-Ready Skills&#10;Certificate&#10;Expert Instructors"
                                rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">What You Will Learn</label>
                            <textarea value={courseInfo.whatYouWillLearn} onChange={e => setCourseInfo(p => ({ ...p, whatYouWillLearn: e.target.value }))}
                                rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Prerequisites</label>
                            <textarea value={courseInfo.prerequisites} onChange={e => setCourseInfo(p => ({ ...p, prerequisites: e.target.value }))}
                                rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600 resize-none" />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                        <h3 className="text-base font-black text-white uppercase tracking-tight">Summary</h3>
                        {[
                            { label: 'Modules', value: modules.length },
                            { label: 'Total Lessons', value: totalLessons },
                            { label: 'Videos', value: modules.reduce((a, m) => a + m.lessons.filter(l => l.type === 'video').length, 0) },
                            { label: 'Documents', value: modules.reduce((a, m) => a + m.lessons.filter(l => l.type === 'pdf').length, 0) },
                            { label: 'Exams', value: modules.reduce((a, m) => a + m.lessons.filter(l => l.type === 'exam').length, 0) },
                        ].map(item => (
                            <div key={item.label} className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold">{item.label}</span>
                                <span className="text-white font-black">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
