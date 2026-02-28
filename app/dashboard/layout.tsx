import StudentSidebar from '@/components/student/StudentSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Dashboard | Arqam Academy',
    description: 'Track your learning progress, courses, and certificates.',
};

export default function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Note: Middleware already protects /dashboard, so we assume the user is authenticated and is a student.
    return (
        <div className="min-h-screen bg-dark">
            <StudentSidebar />
            <main className="lg:rtl:mr-72 lg:ltr:ml-72 min-h-screen pt-8 px-4 md:px-8 pb-12 transition-all">
                {children}
            </main>
        </div>
    );
}
