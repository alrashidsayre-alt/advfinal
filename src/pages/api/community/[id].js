import pool from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Check if user owns the post
      const [posts] = await pool.query(
        'SELECT user_id FROM community_posts WHERE id = ?',
        [id]
      );

      if (posts.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (posts[0].user_id !== user.userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this post' });
      }

      await pool.query('DELETE FROM community_posts WHERE id = ?', [id]);

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}