import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import User from '@/models/User';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(`login_${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, phone, password } = await request.json();

    if ((!email && !phone) || !password) {
      return NextResponse.json(
        { error: 'Credentials missing' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email or phone
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if banned
    if (user.status === 'banned') {
      return NextResponse.json(
        { error: 'Account has been suspended' },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          targetGoal: user.targetGoal,
          enrolledTracks: user.enrolledTracks || [],
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
