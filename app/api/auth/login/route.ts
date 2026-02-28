import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
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
        { error: 'User not found' },
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

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'arqam_platform_secret_key_2026_secure',
      { expiresIn: '7d' }
    );

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
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
