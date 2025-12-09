import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [sessions] = await pool.query(
      `SELECT ws.*, wp.name as plan_name 
       FROM workout_sessions ws
       LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id
       WHERE ws.user_id = ?
       ORDER BY ws.session_date DESC
       LIMIT 50`,
      [user.userId]
    );

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
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
    const { workout_plan_id, session_date, duration_minutes, notes, exercises } = body;

    // Validate
    if (!session_date) {
      return NextResponse.json(
        { error: 'Session date is required' },
        { status: 400 }
      );
    }

    // Insert workout session
    const [result] = await pool.query(
      `INSERT INTO workout_sessions (user_id, workout_plan_id, session_date, duration_minutes, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [user.userId, workout_plan_id || null, session_date, duration_minutes || null, notes || null]
    );

    const sessionId = result.insertId;

    // Insert exercises if provided
    if (exercises && exercises.length > 0) {
      const exerciseValues = exercises.map(ex => [
        sessionId,
        ex.exercise_id,
        ex.sets || 0,
        ex.reps || 0,
        ex.weight || null,
        ex.notes || null
      ]);

      await pool.query(
        `INSERT INTO session_exercises (session_id, exercise_id, sets, reps, weight, notes)
         VALUES ?`,
        [exerciseValues]
      );
    }

    return NextResponse.json(
      { message: 'Workout session created', sessionId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: 'Failed to create workout session' },
      { status: 500 }
    );
  }
}