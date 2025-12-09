import pool from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { post_id } = req.body;

    // Check if already liked
    const [existing] = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [post_id, user.userId]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [post_id, user.userId]
      );
      await pool.query(
        'UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = ?',
        [post_id]
      );
      return res.status(200).json({ liked: false });
    } else {
      // Like
      await pool.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [post_id, user.userId]
      );
      await pool.query(
        'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?',
        [post_id]
      );
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ error: 'Failed to process like' });
  }
}