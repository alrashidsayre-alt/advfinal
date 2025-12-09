import pool from '../../lib/db';
import { getUserFromRequest } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { plan_id } = req.query;

      if (!plan_id) {
        return res.status(400).json({ error: 'Plan ID is required' });
      }

      const [comments] = await pool.query(
        `SELECT c.*, u.username, u.profile_picture
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.workout_plan_id = ?
         ORDER BY c.created_at DESC`,
        [plan_id]
      );

      return res.status(200).json({ comments });

    } catch (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  if (req.method === 'POST') {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { workout_plan_id, comment_text } = req.body;

      if (!workout_plan_id || !comment_text || comment_text.trim() === '') {
        return res.status(400).json({ error: 'Plan ID and comment text are required' });
      }

      const [result] = await pool.query(
        'INSERT INTO comments (user_id, workout_plan_id, comment_text) VALUES (?, ?, ?)',
        [user.userId, workout_plan_id, comment_text]
      );

      return res.status(201).json({ message: 'Comment added', commentId: result.insertId });

    } catch (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}