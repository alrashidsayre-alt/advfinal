import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [photos] = await pool.query(
      'SELECT * FROM progress_photos WHERE user_id = ? ORDER BY photo_date DESC',
      [user.userId]
    );

    return NextResponse.json({ photos });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress photos' },
      { status: 500 }
    );
  }
}