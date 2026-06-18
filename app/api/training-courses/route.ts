export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingCourse from '@/models/TrainingCourse';
import { authenticateRequest } from '@/lib/auth';

const SEED_COURSES = [
  {
    titleAr: "الشهادة الدولية الأساسية للحاسب والإنترنت (IC3)",
    titleEn: "Internet and Computing Core Certification (IC3)",
    descriptionAr: "تعلم أساسيات الحاسوب والإنترنت والبرامج المكتبية بشكل احترافي معتمد.",
    descriptionEn: "Learn computer basics, internet, and office software with a certified international program.",
    duration: "30 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "الرخصة الدولية لقيادة الحاسب الآلي (ICDL)",
    titleEn: "International Computer Driving License (ICDL)",
    descriptionAr: "الدورة الشاملة لتأهيلك لاستخدام الحاسب الآلي في بيئة العمل باحترافية.",
    descriptionEn: "Comprehensive course to qualify you for professional computer use in work environments.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "شهادة مايكروسوفت أوفيس المتخصصة (MOS)",
    titleEn: "Microsoft Office Specialist (MOS)",
    descriptionAr: "احترف برامج مايكروسوفت أوفيس (Word, Excel, PowerPoint) واحصل على الاعتماد الدولي.",
    descriptionEn: "Master Microsoft Office programs (Word, Excel, PowerPoint) and get internationally certified.",
    duration: "35 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "الرخصة الدولية لقيادة الحاسب الآلي للمعلم (ICDL Teacher)",
    titleEn: "ICDL Teacher License",
    descriptionAr: "إعداد المعلمين لتوظيف تكنولوجيا المعلومات والاتصالات في العملية التعليمية.",
    descriptionEn: "Preparing teachers to integrate ICT in the educational process effectively.",
    duration: "45 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "إكسيل متقدم (Advanced Excel)",
    titleEn: "Advanced Excel",
    descriptionAr: "تحليل البيانات، بناء التقارير والمخططات الديناميكية واستخدام الدوال المتقدمة.",
    descriptionEn: "Data analysis, dynamic reports/charts creation, and using advanced Excel formulas.",
    duration: "25 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "المحاسبة الإلكترونية (AC5)",
    titleEn: "Electronic Accounting (AC5)",
    descriptionAr: "تطبيق المبادئ المحاسبية باستخدام البرمجيات والأنظمة الإلكترونية الحديثة.",
    descriptionEn: "Applying accounting principles using modern accounting software and electronic systems.",
    duration: "30 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "التسويق الرقمي (Digital Marketing)",
    titleEn: "Digital Marketing",
    descriptionAr: "احترف إعلانات السوشيال ميديا، تحسين محركات البحث، ووضع الخطط التسويقية الناجحة.",
    descriptionEn: "Master social media ads, SEO, and building successful marketing strategies.",
    duration: "35 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "الموارد البشرية (HR)",
    titleEn: "Human Resources (HR)",
    descriptionAr: "فهم وظائف إدارة الموارد البشرية من التوظيف والتدريب والرواتب والتطوير المؤسسي.",
    descriptionEn: "Understand HR management functions from recruitment and training to payroll and org dev.",
    duration: "30 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "اللغة الإنجليزية (المستوى المبتدئ)",
    titleEn: "English (Beginner Level)",
    descriptionAr: "بناء أساس قوي في قواعد ونطق ومحادثة اللغة الإنجليزية للمبتدئين.",
    descriptionEn: "Build a strong foundation in English grammar, pronunciation, and basic conversation.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "languages",
    isActive: true
  },
  {
    titleAr: "اللغة الإنجليزية (المستوى المتوسط)",
    titleEn: "English (Intermediate Level)",
    descriptionAr: "تطوير مهارات الاستماع والتحدث والكتابة باللغة الإنجليزية للمستويات المتوسطة.",
    descriptionEn: "Develop listening, speaking, and writing English skills for intermediate learners.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "languages",
    isActive: true
  },
  {
    titleAr: "اللغة الإنجليزية (المستوى المتقدم)",
    titleEn: "English (Advanced Level)",
    descriptionAr: "إتقان المحادثة بطلاقة والكتابة الأكاديمية والمهنية باللغة الإنجليزية.",
    descriptionEn: "Master fluent conversation and academic/professional writing in English.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "languages",
    isActive: true
  },
  {
    titleAr: "صيانة الموبايل",
    titleEn: "Mobile Maintenance",
    descriptionAr: "دورة عملية متكاملة في صيانة الهاردوير والسوفتوير لجميع أنواع الهواتف الذكية.",
    descriptionEn: "A complete practical course in hardware and software maintenance for all smartphones.",
    duration: "50 Hours",
    studyMode: "Offline",
    category: "networks",
    isActive: true
  },
  {
    titleAr: "دبلومة الجرافيك (Graphic Diploma)",
    titleEn: "Graphic Diploma",
    descriptionAr: "احترف التصميم الإبداعي من الصفر باستخدام أشهر برامج التصميم العالمية.",
    descriptionEn: "Master creative design from scratch using the world's most famous design software.",
    duration: "60 Hours",
    studyMode: "Offline",
    category: "graphic",
    isActive: true
  },
  {
    titleAr: "برنامج فوتوشوب",
    titleEn: "Adobe Photoshop Course",
    descriptionAr: "تعلم دمج وتعديل الصور وتصميم البوسترات وتصميمات السوشيال ميديا باحترافية.",
    descriptionEn: "Learn image manipulation, editing, poster design, and professional social media design.",
    duration: "20 Hours",
    studyMode: "Offline",
    category: "graphic",
    isActive: true
  },
  {
    titleAr: "برنامج إليستريتور",
    titleEn: "Adobe Illustrator Course",
    descriptionAr: "رسم الشعارات والرموز والتصاميم المتجهة (Vectors) بدقة وجودة عالية.",
    descriptionEn: "Draw logos, icons, and vector illustrations with precision and high resolution.",
    duration: "20 Hours",
    studyMode: "Offline",
    category: "graphic",
    isActive: true
  },
  {
    titleAr: "برنامج إن ديزاين",
    titleEn: "Adobe InDesign Course",
    descriptionAr: "تنسيق الكتب والمجلات والبروشورات وتجهيزها للطباعة والنشر الإلكتروني.",
    descriptionEn: "Typeset books, magazines, brochures and prepare them for printing and digital publishing.",
    duration: "15 Hours",
    studyMode: "Offline",
    category: "graphic",
    isActive: true
  },
  {
    titleAr: "أساسيات البرمجة باستخدام Python",
    titleEn: "Programming Basics with Python",
    descriptionAr: "مدخلك إلى عالم البرمجة وتطوير التفكير المنطقي وبناء برامج بسيطة بلغة بايثون.",
    descriptionEn: "Your entry to programming, developing logical thinking, and building simple programs with Python.",
    duration: "30 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "كورسات الأطفال",
    titleEn: "Kids Tech & Coding Courses",
    descriptionAr: "تعليم البرمجة والتفكير المنطقي للأطفال باستخدام Scratch وتطوير الألعاب البسيطة.",
    descriptionEn: "Teaching coding and logical thinking for kids using Scratch and simple game development.",
    duration: "25 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "تحليل البيانات (Data Analysis)",
    titleEn: "Data Analysis",
    descriptionAr: "استخراج الأفكار والرؤى من البيانات الكبيرة باستخدام Excel, SQL, و Tableau.",
    descriptionEn: "Extract insights and patterns from big data using Excel, SQL, and Tableau.",
    duration: "45 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "تدريب المدربين (TOT)",
    titleEn: "Training of Trainers (TOT)",
    descriptionAr: "تأهيلك لتصبح مدرباً محترفاً قادراً على تصميم وإلقاء الحقائب التدريبية بفاعلية.",
    descriptionEn: "Qualifying you to become a professional trainer capable of designing and delivering trainings.",
    duration: "35 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "كورس ODOO",
    titleEn: "Odoo ERP System Course",
    descriptionAr: "إدارة موارد الشركات وتطوير واستخدام موديولات نظام Odoo المحاسبي والإداري.",
    descriptionEn: "Enterprise resource planning, configuring and using Odoo ERP modules for business.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "business",
    isActive: true
  },
  {
    titleAr: "React Frontend",
    titleEn: "React Frontend Development",
    descriptionAr: "بناء واجهات مستخدم تفاعلية وحديثة باستخدام React.js و Next.js.",
    descriptionEn: "Build modern, interactive web user interfaces using React.js and Next.js.",
    duration: "50 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "Angular Frontend",
    titleEn: "Angular Frontend Development",
    descriptionAr: "احترف بناء تطبيقات الويب الضخمة والقوية باستخدام إطار عمل Angular.",
    descriptionEn: "Master building robust, large-scale web applications using Angular framework.",
    duration: "50 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "Mobile App Development",
    titleEn: "Mobile App Development",
    descriptionAr: "بناء تطبيقات للهواتف الذكية (Android & iOS) باستخدام Flutter أو React Native.",
    descriptionEn: "Build mobile applications for Android & iOS using Flutter or React Native.",
    duration: "60 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "Full Stack .NET",
    titleEn: "Full Stack .NET Development",
    descriptionAr: "دورة شاملة في برمجة الويب باستخدام ASP.NET Core وقواعد بيانات SQL Server مع Angular/React.",
    descriptionEn: "Comprehensive course in web development using ASP.NET Core, SQL Server, and React/Angular.",
    duration: "80 Hours",
    studyMode: "Offline",
    category: "programming",
    isActive: true
  },
  {
    titleAr: "Microsoft Machine Learning",
    titleEn: "Microsoft Machine Learning",
    descriptionAr: "تطبيق تقنيات تعلم الآلة وتحليل البيانات الإحصائية باستخدام أدوات مايكروسوفت وسحابة Azure.",
    descriptionEn: "Applying ML algorithms and data analytics using Microsoft tools and Azure cloud.",
    duration: "45 Hours",
    studyMode: "Offline",
    category: "ai",
    isActive: true
  },
  {
    titleAr: "Artificial Intelligence",
    titleEn: "Artificial Intelligence",
    descriptionAr: "فهم وتطبيق الشبكات العصبية والذكاء الاصطناعي التوليدي ونظم الرؤية الحاسوبية.",
    descriptionEn: "Understand and apply neural networks, generative AI, and computer vision systems.",
    duration: "50 Hours",
    studyMode: "Offline",
    category: "ai",
    isActive: true
  },
  {
    titleAr: "Cyber Security",
    titleEn: "Cyber Security",
    descriptionAr: "تعلم أساسيات الاختراق الأخلاقي، تأمين الشبكات، واكتشاف الثغرات الأمنية.",
    descriptionEn: "Learn ethical hacking basics, network security, and vulnerability assessments.",
    duration: "60 Hours",
    studyMode: "Offline",
    category: "networks",
    isActive: true
  },
  {
    titleAr: "CCNA",
    titleEn: "Cisco Certified Network Associate (CCNA)",
    descriptionAr: "بناء وإدارة شبكات سيسكو السلكية واللاسلكية وفهم مفاهيم التوجيه والتحويل.",
    descriptionEn: "Build and manage Cisco wired/wireless networks, understanding routing and switching.",
    duration: "40 Hours",
    studyMode: "Offline",
    category: "networks",
    isActive: true
  },
  {
    titleAr: "MCSA",
    titleEn: "Microsoft Certified Solutions Associate (MCSA)",
    descriptionAr: "إدارة خوادم ويندوز (Windows Server) وإدارة بيئة الشبكة للمؤسسات.",
    descriptionEn: "Administer Windows Server infrastructure and manage enterprise network environments.",
    duration: "45 Hours",
    studyMode: "Offline",
    category: "networks",
    isActive: true
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    let courses = await TrainingCourse.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Seed if empty
    if (courses.length === 0) {
      await TrainingCourse.insertMany(SEED_COURSES);
      courses = await TrainingCourse.find({ isActive: true }).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(courses, { status: 200 });
  } catch (error: any) {
    console.error('[Training Courses GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch courses' }, { status: 500 });
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
    const { titleAr, titleEn, descriptionAr, descriptionEn, thumbnail, duration, studyMode, category } = body;
    
    if (!titleAr || !titleEn || !descriptionAr || !descriptionEn || !duration || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newCourse = new TrainingCourse({
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      thumbnail,
      duration,
      studyMode: studyMode || 'Offline',
      category,
      isActive: true
    });
    
    await newCourse.save();
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error('[Training Courses POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}
