export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (should be PDF or Document)
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      return NextResponse.json({ error: 'Only PDF or DOC files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define path
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');
    
    // Create directory if not exists
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    const publicUrl = `/uploads/cvs/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name
    }, { status: 200 });

  } catch (error: any) {
    console.error('[CV Upload] Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
