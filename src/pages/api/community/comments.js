import pool from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { post_id } = req.query;

      const [comments] = await pool.query(
        `SELECT pc.*, u.username, u.profile_picture
         FROM post_comments pc
         JOIN users u ON pc.user_id = u.id
         WHERE pc.post_id = ?
         ORDER BY pc.created_at DESC`,
        [post_id]
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
      const { post_id, comment_text } = req.body;

      if (!comment_text || comment_text.trim() === '') {
        return res.status(400).json({ error: 'Comment text is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
        [post_id, user.userId, comment_text]
      );

      return res.status(201).json({ 
        message: 'Comment added',
        commentId: result.insertId 
      });
    } catch (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}