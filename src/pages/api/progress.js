import pool from '../../lib/db';
import { getUserFromRequest } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [photos] = await pool.query(
      'SELECT * FROM progress_photos WHERE user_id = ? ORDER BY photo_date DESC',
      [user.userId]
    );

    return res.status(200).json({ photos });

  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({ error: 'Failed to fetch progress photos' });
  }
}