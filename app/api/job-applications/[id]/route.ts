export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import { authenticateRequest } from '@/lib/auth';

const VALID_STATUSES = ['new', 'reviewed', 'interview', 'accepted', 'rejected'];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    const updated = await JobApplication.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('[Job Application PATCH] Error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await JobApplication.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('[Job Application DELETE] Error:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
