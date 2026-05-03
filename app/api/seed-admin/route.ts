import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@arqam.academy';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Arqam@Admin!2026$#';
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            existingAdmin.email = adminEmail;
            existingAdmin.password = hashedPassword;
            existingAdmin.name = 'Platform Admin';
            await existingAdmin.save();
            return NextResponse.json({ message: 'Admin credentials updated successfully' });
        }

        await User.create({
            name: 'Platform Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({ message: 'Admin created successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
