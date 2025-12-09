import pool from '../../lib/db';
import { getUserFromRequest } from '../../lib/auth';

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const [sessions] = await pool.query(
        `SELECT ws.*, wp.name as plan_name 
         FROM workout_sessions ws
         LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id
         WHERE ws.user_id = ?
         ORDER BY ws.session_date DESC
         LIMIT 50`,
        [user.userId]
      );

      return res.status(200).json({ sessions });

    } catch (error) {
      console.error('Get workouts error:', error);
      return res.status(500).json({ error: 'Failed to fetch workouts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { workout_plan_id, session_date, duration_minutes, notes, exercises } = req.body;

      // Validate
      if (!session_date) {
        return res.status(400).json({ error: 'Session date is required' });
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

      return res.status(201).json({ message: 'Workout session created', sessionId });

    } catch (error) {
      console.error('Create workout error:', error);
      return res.status(500).json({ error: 'Failed to create workout session' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}