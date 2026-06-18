import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingCourse from '@/models/TrainingCourse';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const updatedCourse = await TrainingCourse.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error: any) {
    console.error('Update Training Course Error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const deletedCourse = await TrainingCourse.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete Training Course Error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
