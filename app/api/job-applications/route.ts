export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Admin only
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search    = searchParams.get('search')   || '';
    const jobTitle  = searchParams.get('jobTitle') || '';
    const status    = searchParams.get('status')   || '';

    const query: any = {};

    if (search) {
      query.$or = [
        { fullName:    { $regex: search, $options: 'i' } },
        { phone:       { $regex: search, $options: 'i' } },
        { email:       { $regex: search, $options: 'i' } },
        { jobTitle:    { $regex: search, $options: 'i' } },
        { governorate: { $regex: search, $options: 'i' } },
      ];
    }

    if (jobTitle) query.jobTitle = jobTitle;
    if (status)   query.status   = status;

    const applications = await JobApplication.find(query).sort({ createdAt: -1 });
    return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
    console.error('[Job Applications GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      fullName, phone, email,
      college, studyYear, specialization, governorate,
      jobId, jobTitle, cvUrl, notes
    } = body;

    if (!fullName || !phone || !email || !college || !studyYear || !specialization || !governorate || !jobTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newApplication = new JobApplication({
      fullName, phone, email,
      college, studyYear, specialization, governorate,
      jobId: jobId || undefined,
      jobTitle, cvUrl, notes,
      status: 'new',
    });

    await newApplication.save();
    return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
  } catch (error: any) {
    console.error('[Job Applications POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit application' }, { status: 500 });
  }
}
