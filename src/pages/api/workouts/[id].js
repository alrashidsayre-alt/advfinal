import pool from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Get workout session
      const [sessions] = await pool.query(
        `SELECT ws.*, wp.name as plan_name 
         FROM workout_sessions ws
         LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id
         WHERE ws.id = ? AND ws.user_id = ?`,
        [id, user.userId]
      );

      if (sessions.length === 0) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      // Get exercises for this session
      const [exercises] = await pool.query(
        `SELECT se.*, e.name as exercise_name, e.category, e.muscle_group
         FROM session_exercises se
         JOIN exercises e ON se.exercise_id = e.id
         WHERE se.session_id = ?
         ORDER BY se.id`,
        [id]
      );

      console.log('Fetched exercises for workout:', id, exercises);

      return res.status(200).json({
        session: sessions[0],
        exercises: exercises
      });

    } catch (error) {
      console.error('Get workout details error:', error);
      return res.status(500).json({ error: 'Failed to fetch workout details', details: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Verify the workout belongs to the user
      const [sessions] = await pool.query(
        'SELECT id FROM workout_sessions WHERE id = ? AND user_id = ?',
        [id, user.userId]
      );

      if (sessions.length === 0) {
        return res.status(404).json({ error: 'Workout not found or unauthorized' });
      }

      // Delete associated exercises first (due to foreign key)
      await pool.query('DELETE FROM session_exercises WHERE session_id = ?', [id]);

      // Delete the workout session
      await pool.query('DELETE FROM workout_sessions WHERE id = ?', [id]);

      console.log('Deleted workout:', id);

      return res.status(200).json({ message: 'Workout deleted successfully' });

    } catch (error) {
      console.error('Delete workout error:', error);
      return res.status(500).json({ error: 'Failed to delete workout', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}