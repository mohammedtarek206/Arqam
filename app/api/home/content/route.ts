import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';

const sanitizeImageUrl = (url: any) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('/') || url.startsWith('http') || url.startsWith('data:')) {
        return url;
    }
    return null;
};

export async function GET() {
    try {
        await connectDB();

        // Fetch latest 8 active courses
        const rawCourses = await Course.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .populate({
                path: 'instructor',
                select: 'name image',
                model: User
            })
            .lean();

        const courses = rawCourses.map((course: any) => ({
            ...course,
            thumbnail: sanitizeImageUrl(course.thumbnail),
            instructor: {
                ...course.instructor,
                image: course.instructor ? sanitizeImageUrl(course.instructor.image) : null
            }
        }));

        return NextResponse.json({ courses, lessons: [] }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching home content:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
