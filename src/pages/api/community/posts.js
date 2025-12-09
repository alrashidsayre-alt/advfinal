import pool from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [posts] = await pool.query(
        `SELECT cp.*, u.username, u.profile_picture,
         (SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) as comment_count
         FROM community_posts cp
         JOIN users u ON cp.user_id = u.id
         ORDER BY cp.created_at DESC
         LIMIT 50`
      );

      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Get posts error:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  if (req.method === 'POST') {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { content, image_url } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Content is required' });
      }

      const [result] = await pool.query(
        'INSERT INTO community_posts (user_id, content, image_url) VALUES (?, ?, ?)',
        [user.userId, content, image_url || null]
      );

      return res.status(201).json({ 
        message: 'Post created successfully',
        postId: result.insertId 
      });
    } catch (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}