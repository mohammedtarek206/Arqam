'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBook, FiClock, FiSearch, FiCheckCircle, FiX, FiBookOpen,
  FiMapPin, FiAward, FiLayers, FiTag
} from 'react-icons/fi';
import Image from 'next/image';

const GOVERNORATES = [
  'المنيا', 'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'البحيرة', 'مطروح',
  'دمياط', 'الدقهلية', 'كفر الشيخ', 'الغربية', 'المنوفية', 'الشرقية', 'بور سعيد',
  'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء', 'بني سويف', 'الفيوم',
  'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد'
];

export default function TrainingCoursesPage() {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    college: '',
    studyYear: '',
    governorate: 'المنيا',
    notes: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/training-courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Failed to fetch training courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      college: '',
      studyYear: '',
      governorate: isRtl ? 'المنيا' : 'Minya',
      notes: ''
    });
    setSubmitSuccess(false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/training-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          courseName: isRtl ? selectedCourse.titleAr : selectedCourse.titleEn,
          courseId: selectedCourse._id
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Clear form
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          college: '',
          studyYear: '',
          governorate: isRtl ? 'المنيا' : 'Minya',
          notes: ''
        });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || (isRtl ? 'فشل إرسال طلب التسجيل' : 'Failed to submit registration'));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(isRtl ? 'حدث خطأ في الاتصال بالخادم' : 'An error occurred connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  // Category Icons & colors mapping
  const categoryConfig: Record<string, { bg: string, border: string, text: string, gradient: string }> = {
    programming: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', gradient: 'from-indigo-600 to-cyan-500' },
    graphic: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', gradient: 'from-pink-600 to-rose-400' },
    languages: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', gradient: 'from-emerald-600 to-teal-500' },
    networks: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', gradient: 'from-violet-600 to-fuchsia-500' },
    ai: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-600 to-blue-500' },
    business: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-600 to-orange-500' }
  };

  const getCategoryConfig = (cat: string) => {
    return categoryConfig[cat] || { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary', gradient: 'from-primary to-accent' };
  };

  // Filtering & Search
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const title = (isRtl ? course.titleAr : course.titleEn).toLowerCase();
    const desc = (isRtl ? course.descriptionAr : course.descriptionEn).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: isRtl ? 'الكل' : 'All' },
    { id: 'programming', label: isRtl ? 'برمجة' : 'Programming' },
    { id: 'graphic', label: isRtl ? 'جرافيك' : 'Graphics' },
    { id: 'languages', label: isRtl ? 'لغات' : 'Languages' },
    { id: 'networks', label: isRtl ? 'شبكات' : 'Networks' },
    { id: 'ai', label: isRtl ? 'ذكاء اصطناعي' : 'AI' },
    { id: 'business', label: isRtl ? 'إدارة أعمال / Business' : 'Business' }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[30rem] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
          >
            <FiAward className="w-3.5 h-3.5" />
            {isRtl ? 'تدريب احترافي أوفلاين' : 'Professional Offline Training'}
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-none py-1">
            {isRtl ? 'الكورسات والتدريبات' : 'Courses & Trainings'}
          </h1>
          <p className="text-foreground/60 font-bold max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {isRtl
              ? 'سجل بياناتك الآن لتبدأ رحلة التدريب الاحترافي والتأهيل لسوق العمل بدون الحاجة لإنشاء حساب أو تسجيل دخول.'
              : 'Register now to start professional training and job-ready qualification without login or registration requirements.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass rounded-[2rem] border border-white/5 p-6 space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5 rtl:left-auto rtl:right-4" />
              <input
                type="text"
                placeholder={isRtl ? 'ابحث عن كورس...' : 'Search for a course...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface/50 border border-border rounded-xl text-foreground font-bold text-sm focus:border-primary/50 focus:outline-none transition-all rtl:pl-4 rtl:pr-12"
              />
            </div>
            
            {/* Category Filter Desktop */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 border ${
                    selectedCategory === cat.id
                      ? 'bg-primary border-primary text-white shadow-lg'
                      : 'bg-surface/50 border-border text-foreground/40 hover:text-primary hover:bg-foreground/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Mobile/Tablet */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 justify-start">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-primary border-primary text-white shadow-lg'
                    : 'bg-surface border-border text-foreground/40 hover:text-primary hover:bg-foreground/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Cards Grid */
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, i) => {
                const conf = getCategoryConfig(course.category);
                return (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all flex flex-col justify-between relative h-full"
                  >
                    <div>
                      {/* Thumbnail with gradient pattern if no image */}
                      <div className="w-full h-48 relative overflow-hidden shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={isRtl ? course.titleAr : course.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${conf.gradient} flex items-center justify-center relative opacity-85 group-hover:scale-105 transition-transform duration-700`}>
                            <FiBookOpen className="w-16 h-16 text-white/40 drop-shadow-md" />
                            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-xl px-3 py-1 border border-white/20 text-xs font-black text-white uppercase">
                              {isRtl ? 'Arqam' : 'Arqam'}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-primary/20">
                          <span className="text-xs font-black text-primary">
                            {course.studyMode === 'Both' ? (isRtl ? 'أونلاين / أوفلاين' : 'Online / Offline') : (isRtl ? 'أوفلاين' : 'Offline')}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col relative -mt-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${conf.bg} ${conf.border} ${conf.text} border px-3 py-1 rounded-lg w-max mb-3`}>
                          {isRtl ? t(`field_${course.category}`) : course.category}
                        </span>

                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                          {isRtl ? course.titleAr : course.titleEn}
                        </h3>
                        
                        <p className="text-xs text-foreground/50 font-bold leading-relaxed line-clamp-3">
                          {isRtl ? course.descriptionAr : course.descriptionEn}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center text-[10px] font-bold text-foreground/40 uppercase py-4 border-t border-border">
                        <span className="flex items-center gap-1.5"><FiLayers /> {isRtl ? 'جميع المستويات' : 'All Levels'}</span>
                        <span className="flex items-center gap-1.5"><FiClock /> {course.duration}</span>
                      </div>

                      <button
                        onClick={() => handleOpenModal(course)}
                        className="w-full py-3 bg-primary hover:bg-primary/80 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all border border-primary/20"
                      >
                        {isRtl ? 'سجل الآن' : 'Register Now'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20 glass rounded-[2rem] border border-white/5 max-w-xl mx-auto space-y-4">
            <FiBook className="w-12 h-12 text-foreground/20 mx-auto" />
            <p className="text-foreground/50 font-black text-lg">{isRtl ? 'لا يوجد كورسات مطابقة لبحثك' : 'No courses matching your search'}</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-black rounded-xl hover:bg-primary/20 transition-all">
              {isRtl ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                    {isRtl ? 'سجل بياناتك لحجز مكانك' : 'Register to book your seat'}
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {isRtl ? selectedCourse.titleAr : selectedCourse.titleEn}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Form Content / Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {submitSuccess ? (
                  <div className="text-center py-10 space-y-4">
                    <FiCheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                    <h4 className="text-xl font-black text-white">{isRtl ? 'تم التسجيل بنجاح!' : 'Registered Successfully!'}</h4>
                    <p className="text-sm text-foreground/60 font-bold max-w-sm mx-auto">
                      {isRtl
                        ? 'تم استلام بياناتك بنجاح، وسوف يتواصل معك أحد ممثلي الأكاديمية قريباً لتأكيد الحجز.'
                        : 'Your data has been received successfully. Our team will contact you shortly to confirm.'}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      {isRtl ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Error Notice */}
                    {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold">
                        {errorMsg}
                      </div>
                    )}
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'الاسم بالكامل' : 'Full Name'} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'مثال: أحمد محمد علي' : 'e.g. John Doe'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'رقم الهاتف' : 'Phone Number'} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'مثال: 01xxxxxxxxx' : 'e.g. 01xxxxxxxxx'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'example@gmail.com' : 'example@gmail.com'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* College */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'الكلية' : 'College / University'} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="college"
                        required
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'مثال: كلية الحاسبات والمعلومات' : 'e.g. Faculty of Computers and IT'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Study Year */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'السنة الدراسية' : 'Study Year'} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="studyYear"
                        required
                        value={formData.studyYear}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'مثال: الفرقة الثالثة' : 'e.g. 3rd Year'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Governorate Select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'المحافظة' : 'Governorate'} <span className="text-primary">*</span>
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-foreground text-sm font-bold focus:border-primary/50 focus:outline-none transition-all"
                      >
                        {GOVERNORATES.map(gov => (
                          <option key={gov} value={gov} className="bg-surface text-foreground">{gov}</option>
                        ))}
                      </select>
                    </div>

                    {/* Notes (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {isRtl ? 'ملاحظات (اختياري)' : 'Notes / Suggestions (Optional)'}
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder={isRtl ? 'أدخل أي ملاحظات أو استفسارات هنا...' : 'Any comments or special requests...'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold focus:border-primary/50 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all mt-6 disabled:opacity-50"
                    >
                      {submitting ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'تأكيد الحجز' : 'Confirm Registration')}
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
