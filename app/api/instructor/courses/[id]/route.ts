import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        await connectDB();

        // Ensure instructor owns the course
        const course = await Course.findOneAndUpdate(
            { _id: params.id, instructor: user.userId },
            data,
            { new: true }
        );

        if (!course) {
            return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Course updated successfully', course },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Instructor Courses API PATCH error:', error);
        return NextResponse.json(
            { error: 'Failed to update course' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Ensure instructor owns the course
        const course = await Course.findOneAndDelete({ _id: params.id, instructor: user.userId });

        if (!course) {
            return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Course deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Instructor Courses API DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete course' },
            { status: 500 }
        );
    }
}
