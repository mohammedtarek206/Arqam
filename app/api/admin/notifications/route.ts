import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

// Send mass announcements
export async function POST(request: NextRequest) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, message, audience, type = 'info' } = body;

        if (!title || !message || !audience) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        let targetUsers = [];

        if (audience === 'all') {
            targetUsers = await User.find({ status: 'active' }).select('_id');
        } else if (audience === 'students') {
            targetUsers = await User.find({ role: 'student', status: 'active' }).select('_id');
        } else if (audience === 'instructors') {
            targetUsers = await User.find({ role: 'instructor', status: 'active' }).select('_id');
        } else {
            return NextResponse.json({ error: 'Invalid audience' }, { status: 400 });
        }

        const notificationDocs = targetUsers.map(u => ({
            recipient: u._id,
            title,
            message,
            type,
            read: false
        }));

        if (notificationDocs.length > 0) {
            await Notification.insertMany(notificationDocs);
        }

        return NextResponse.json({
            message: `Announcement sent to ${notificationDocs.length} users successfully`
        }, { status: 200 });
    } catch (error: any) {
        console.error('Send announcement error:', error);
        return NextResponse.json(
            { error: 'Failed to send announcement' },
            { status: 500 }
        );
    }
}
