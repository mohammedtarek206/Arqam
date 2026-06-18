export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { authenticateRequest } from '@/lib/auth';

const SEED_JOBS = [
  {
    titleAr: "مطور واجهات أمامية (React / Next.js)",
    titleEn: "Frontend Developer (React / Next.js)",
    descriptionAr: "مطلوب مطور واجهات أمامية بخبرة لا تقل عن سنتين في بناء تطبيقات الويب التفاعلية باستخدام React و Next.js و Tailwind CSS.",
    descriptionEn: "Looking for a Frontend Developer with 2+ years of experience building interactive web applications using React, Next.js, and Tailwind CSS.",
    requirementsAr: [
      "خبرة عملية في React.js و Next.js",
      "إتقان HTML5, CSS3, JavaScript (ES6+), TypeScript",
      "فهم عميق للتصميم المتجاوب وتجربة المستخدم UX/UI",
      "معرفة جيدة بنظام Git والتحكم في الإصدارات"
    ],
    requirementsEn: [
      "Hands-on experience with React.js and Next.js",
      "Proficient in HTML5, CSS3, JavaScript (ES6+), TypeScript",
      "Deep understanding of responsive design and UI/UX",
      "Good knowledge of Git and version control systems"
    ],
    category: "programming",
    type: "Full-time",
    locationAr: "عن بعد",
    locationEn: "Remote",
    salary: "Negotiable",
    isActive: true
  },
  {
    titleAr: "مصمم جرافيك وواجهات مستخدم (UI/UX Designer)",
    titleEn: "UI/UX & Graphic Designer",
    descriptionAr: "نبحث عن مصمم مبدع لتصميم هويات بصرية وواجهات مستخدم تطبيقات الموبايل والمواقع الإلكترونية باستخدام Figma و Photoshop.",
    descriptionEn: "We are seeking a creative designer to design visual identities and user interfaces for mobile apps and websites using Figma and Photoshop.",
    requirementsAr: [
      "خبرة سابقة في تصميم واجهات المستخدم للموبايل والويب",
      "إتقان Figma, Adobe Photoshop, Illustrator",
      "القدرة على إنشاء Wireframes ونماذج أولية تفاعلية Prototypes",
      "معرض أعمال قوي يوضح المشاريع السابقة"
    ],
    requirementsEn: [
      "Previous experience designing user interfaces for mobile and web",
      "Proficient in Figma, Adobe Photoshop, Illustrator",
      "Ability to create wireframes and interactive prototypes",
      "Strong portfolio showcasing previous design projects"
    ],
    category: "graphic",
    type: "Full-time",
    locationAr: "عن بعد",
    locationEn: "Remote",
    salary: "Negotiable",
    isActive: true
  },
  {
    titleAr: "أخصائي تسويق رقمي (Digital Marketing Specialist)",
    titleEn: "Digital Marketing Specialist",
    descriptionAr: "مطلوب متخصص تسويق رقمي لإدارة الحملات الإعلانية على منصات التواصل الاجتماعي وتحسين محركات البحث SEO وتحليل البيانات.",
    descriptionEn: "Required digital marketing specialist to manage ad campaigns on social media platforms, improve SEO, and analyze marketing data.",
    requirementsAr: [
      "خبرة في إعلانات Facebook, Instagram, Google Ads",
      "فهم ممتاز لتهيئة محركات البحث (SEO)",
      "مهارات ممتازة في كتابة المحتوى التسويقي الجذاب",
      "القدرة على تحليل التقارير وتقديم توصيات لتحسين النتائج"
    ],
    requirementsEn: [
      "Experience with Facebook, Instagram, and Google Ads",
      "Excellent understanding of Search Engine Optimization (SEO)",
      "Strong skills in writing engaging marketing copy",
      "Ability to analyze reports and provide recommendations for optimization"
    ],
    category: "business",
    type: "Full-time",
    locationAr: "مقر الشركة (المنيا)",
    locationEn: "On-site (Minya)",
    salary: "Competitive",
    isActive: true
  },
  {
    titleAr: "مدرس لغة إنجليزية (English Instructor)",
    titleEn: "English Instructor",
    descriptionAr: "نبحث عن محاضر لغة إنجليزية متميز لتدريس الطلاب في الأكاديمية وتحسين مهارات التحدث والاستماع لديهم.",
    descriptionEn: "We are looking for an outstanding English instructor to teach students at the academy and improve their speaking and listening skills.",
    requirementsAr: [
      "شهادة في اللغة الإنجليزية أو الآداب أو الترجمة",
      "خبرة في تدريس الكورسات التفاعلية للكبار والأطفال",
      "مهارات تواصل ممتازة وشخصية تفاعلية وجذابة",
      "شهادات تدريس معتمدة مثل TEFL أو CELTA تعد ميزة إضافية"
    ],
    requirementsEn: [
      "Degree in English, Literature, or Translation",
      "Experience teaching interactive courses to adults and kids",
      "Excellent communication skills and engaging personality",
      "Certified teaching credentials (TEFL, CELTA) are a plus"
    ],
    category: "languages",
    type: "Part-time",
    locationAr: "مقر الشركة (المنيا)",
    locationEn: "On-site (Minya)",
    salary: "Per Hour",
    isActive: true
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    let jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Seed if empty
    if (jobs.length === 0) {
      await Job.insertMany(SEED_JOBS);
      jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(jobs, { status: 200 });
  } catch (error: any) {
    console.error('[Jobs GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Auth check
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { titleAr, titleEn, descriptionAr, descriptionEn, requirementsAr, requirementsEn, category, type, locationAr, locationEn, salary } = body;
    
    if (!titleAr || !titleEn || !descriptionAr || !descriptionEn || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newJob = new Job({
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      requirementsAr: requirementsAr || [],
      requirementsEn: requirementsEn || [],
      category,
      type: type || 'Full-time',
      locationAr: locationAr || 'عن بعد',
      locationEn: locationEn || 'Remote',
      salary,
      isActive: true
    });
    
    await newJob.save();
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error('[Jobs POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
  }
}
