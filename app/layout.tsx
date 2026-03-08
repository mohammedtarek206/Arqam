import type { Metadata } from 'next';
import React from 'react';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Arqam Academy | أكاديمية أرقام - تعليم برمجة وتكنولوجيا',
  description: 'Arqam Academy (أكاديمية أرقام) - المنصة الرائدة في بني سويف لتعليم البرمجة، التكنولوجيا، ومهارات المستقبل. نقدم كورسات في الذكاء الاصطناعي، الأمن السيبراني، تحليل البيانات، والعديد من المجالات المعتمدة.',
  keywords: [
    'Arqam Academy', 'أكاديمية أرقام', 'بني سويف', 'Beni Suef', 'رسم', 'Data analysis', 'تحليل بيانات', 'Power bi',
    'Math', 'Science', 'UC math', 'برمجه اطفال', 'براعم مصر الرقميه', 'اشبال مصر الرقميه', 'رواد مصر الرقميه',
    'Ai', 'الذكاء الاصطناعي', 'جرافيك', 'تصميم وانتاج فيديوهات', 'تصوير', 'اكسيل', 'Excel', 'ادخال بيانات',
    'اكسيل محاسبي', 'محاسبه الكترونيه', 'PFA', 'امن معلومات', 'Soft skills', 'شهاده معتمده', 'مركز معتمد',
    'ماركتنج', 'تسويق', 'ICDL', 'مركز تعليم في بني سويف', 'كورس برمجه', 'كورس كمبيوتر', 'تعليم انجليزي',
    'تعليم محادثه', 'Hr', 'الماني', 'برامج هندسيه', 'تخاطب', 'تصميم مواقع', 'كورس هاكر', 'شبكات', 'Cyber security'
  ],
  authors: [{ name: 'Arqam Academy' }],
  creator: 'Arqam Academy',
  publisher: 'Arqam Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.arqamacademic.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Arqam Academy | أكاديمية أرقام',
    description: 'تمكين الجيل القادم من قادة التكنولوجيا. كورسات احترافية في البرمجة والذكاء الاصطناعي.',
    url: 'https://www.arqamacademic.com',
    siteName: 'Arqam Academy',
    images: [
      {
        url: '/logo.png', // Assuming logo.png exists as per earlier metadata
        width: 800,
        height: 600,
        alt: 'Arqam Academy Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arqam Academy | أكاديمية أرقام',
    description: 'تعليم البرمجة والتكنولوجيا للشباب والأطفال.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '5HfQh42j4ifu715DCxeTmkymwCOR-nUvRqFGKZ7BYoE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
