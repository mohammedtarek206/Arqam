export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingRegistration from '@/models/TrainingRegistration';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    // Auth check - Admin only
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status || !['new', 'contacted', 'registered', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
    }
    
    const updated = await TrainingRegistration.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('[Training Registration PATCH] Error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    // Auth check - Admin only
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const deleted = await TrainingRegistration.findByIdAndDelete(params.id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('[Training Registration DELETE] Error:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
