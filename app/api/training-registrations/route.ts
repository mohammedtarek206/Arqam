export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingRegistration from '@/models/TrainingRegistration';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Auth check - Admin only
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const course = searchParams.get('course') || '';
    const status = searchParams.get('status') || '';
    
    // Build filter query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (course) {
      query.courseName = course;
    }
    
    if (status) {
      query.status = status;
    }
    
    const registrations = await TrainingRegistration.find(query).sort({ createdAt: -1 });
    return NextResponse.json(registrations, { status: 200 });
  } catch (error: any) {
    console.error('[Training Registrations GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { fullName, phone, email, college, studyYear, governorate, notes, courseName, courseId } = body;
    
    if (!fullName || !phone || !college || !studyYear || !governorate || !courseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newRegistration = new TrainingRegistration({
      fullName,
      phone,
      email,
      college,
      studyYear,
      governorate,
      notes,
      courseName,
      courseId: courseId || undefined,
      status: 'new'
    });
    
    await newRegistration.save();
    
    return NextResponse.json({ success: true, data: newRegistration }, { status: 201 });
  } catch (error: any) {
    console.error('[Training Registrations POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit registration' }, { status: 500 });
  }
}
