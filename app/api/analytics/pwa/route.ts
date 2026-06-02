import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

export const dynamic = "force-dynamic";

// Create a simple Mongoose schema for PWA analytics
const pwaAnalyticsSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['prompt_shown', 'install_clicked', 'installed', 'prompt_dismissed'],
    required: true,
  },
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

// Avoid re-compiling the model if it's already there
const PWAAnalytics = mongoose.models.PWAAnalytics || mongoose.model('PWAAnalytics', pwaAnalyticsSchema);

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await PWAAnalytics.create({
      action,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PWA Analytics Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
