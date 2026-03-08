import { MetadataRoute } from 'next';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.arqamacademic.com';

    // Static routes
    const staticRoutes = [
        '',
        '/courses',
        '/about',
        '/contact',
        '/pricing',
        '/partners',
        '/projects',
        '/team',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes for courses
    let courseRoutes: any[] = [];
    try {
        await dbConnect();
        const courses = await Course.find({ isActive: true }).select('_id updatedAt');
        courseRoutes = courses.map((course) => ({
            url: `${baseUrl}/courses/${course._id}`,
            lastModified: course.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching courses for sitemap:', error);
    }

    return [...staticRoutes, ...courseRoutes];
}
