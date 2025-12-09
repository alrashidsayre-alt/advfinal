import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, muscle_group } = req.query;

    let query = 'SELECT * FROM exercises WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (muscle_group) {
      query += ' AND muscle_group = ?';
      params.push(muscle_group);
    }

    query += ' ORDER BY name';

    const [exercises] = await pool.query(query, params);

    return res.status(200).json({ exercises });

  } catch (error) {
    console.error('Get exercises error:', error);
    return res.status(500).json({ error: 'Failed to fetch exercises' });
  }
}