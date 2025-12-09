import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getUserFromRequest } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'profile' or 'progress'
    const caption = formData.get('caption');
    const weight = formData.get('weight');
    const photo_date = formData.get('photo_date');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);
    const publicPath = `/uploads/${filename}`;

    // Save file
    await writeFile(filepath, buffer);

    // Update database based on type
    if (type === 'profile') {
      await pool.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [publicPath, user.userId]
      );
    } else if (type === 'progress') {
      await pool.query(
        'INSERT INTO progress_photos (user_id, photo_url, caption, weight, photo_date) VALUES (?, ?, ?, ?, ?)',
        [user.userId, publicPath, caption || null, weight || null, photo_date || new Date().toISOString().split('T')[0]]
      );
    }
    // Community images don't need database update here, handled in posts API

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicPath
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}