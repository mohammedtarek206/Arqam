export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const job = await Job.findByIdAndUpdate(params.id, body, { new: true });

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch (error: any) {
    console.error('[Jobs PATCH]', error);
    return NextResponse.json({ error: error.message || 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findByIdAndDelete(params.id);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Jobs DELETE]', error);
    return NextResponse.json({ error: error.message || 'Failed to delete job' }, { status: 500 });
  }
}
