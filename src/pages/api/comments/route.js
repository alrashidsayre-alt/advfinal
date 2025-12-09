import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('plan_id');

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const [comments] = await pool.query(
      `SELECT c.*, u.username, u.profile_picture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.workout_plan_id = ?
       ORDER BY c.created_at DESC`,
      [planId]
    );

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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
    const { workout_plan_id, comment_text } = body;

    if (!workout_plan_id || !comment_text || comment_text.trim() === '') {
      return NextResponse.json(
        { error: 'Plan ID and comment text are required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO comments (user_id, workout_plan_id, comment_text) VALUES (?, ?, ?)',
      [user.userId, workout_plan_id, comment_text]
    );

    return NextResponse.json(
      { message: 'Comment added', commentId: result.insertId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}