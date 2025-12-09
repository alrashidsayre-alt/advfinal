import pool from '../../lib/db';
import { getUserFromRequest } from '../../lib/auth';

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const showPublic = req.query.public === 'true';

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

      return res.status(200).json({ plans });

    } catch (error) {
      console.error('Get plans error:', error);
      return res.status(500).json({ error: 'Failed to fetch workout plans' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, is_public } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Plan name is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO workout_plans (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
        [user.userId, name, description || '', is_public || false]
      );

      return res.status(201).json({ message: 'Workout plan created', planId: result.insertId });

    } catch (error) {
      console.error('Create plan error:', error);
      return res.status(500).json({ error: 'Failed to create workout plan' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}