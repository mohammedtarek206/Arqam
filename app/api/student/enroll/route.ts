import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Track from '@/models/Track';
import Course from '@/models/Course';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const payload = await authenticateRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { trackId, courseId } = await request.json();
        if (!trackId && !courseId) {
            return NextResponse.json({ error: 'Missing trackId or courseId' }, { status: 400 });
        }

        await connectDB();

        let item: any = null;
        if (trackId) {
            item = await Track.findById(trackId);
        } else if (courseId) {
            item = await Course.findById(courseId);
        }

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Only allow direct enrollment if it's free
        if (item.price > 0) {
            return NextResponse.json({ error: 'This item requires payment' }, { status: 400 });
        }

        const update: any = {};
        if (trackId) {
            update.$addToSet = { enrolledTracks: trackId };
        } else {
            update.$addToSet = { enrolledCourses: courseId };
        }

        await User.findByIdAndUpdate(payload.userId, update);

        return NextResponse.json({ message: 'Enrolled successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Enrollment API error:', error);
        return NextResponse.json(
            { error: 'Failed to enroll' },
            { status: 500 }
        );
    }
}
