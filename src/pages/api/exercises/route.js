import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const muscleGroup = searchParams.get('muscle_group');

    let query = 'SELECT * FROM exercises WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (muscleGroup) {
      query += ' AND muscle_group = ?';
      params.push(muscleGroup);
    }

    query += ' ORDER BY name';

    const [exercises] = await pool.query(query, params);

    return NextResponse.json({ exercises });

  } catch (error) {
    console.error('Get exercises error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}