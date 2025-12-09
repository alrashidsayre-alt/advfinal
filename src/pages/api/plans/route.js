import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const showPublic = searchParams.get('public') === 'true';

    let query = `
      SELECT wp.*, u.username,
      (SELECT COUNT(*) FROM comments WHERE workout_plan_id = wp.id) as comment_count
      FROM workout_plans wp
      JOIN users u ON wp.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (showPublic) {
      query += ' AND (wp.is_public = 1 OR wp.user_id = ?)';
      params.push(user.userId);
    } else {
      query += ' AND wp.user_id = ?';
      params.push(user.userId);
    }

    query += ' ORDER BY wp.created_at DESC';

    const [plans] = await pool.query(query, params);

    return NextResponse.json({ plans });

  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout plans' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, is_public } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO workout_plans (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
      [user.userId, name, description || '', is_public || false]
    );

    return NextResponse.json(
      { message: 'Workout plan created', planId: result.insertId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: 'Failed to create workout plan' },
      { status: 500 }
    );
  }
}