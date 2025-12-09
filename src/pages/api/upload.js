import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { getUserFromRequest } from '../../lib/auth';
import pool from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name, ext, part) => {
        return `${Date.now()}-${part.originalFilename}`;
      }
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      await fs.unlink(file.filepath);
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' });
    }

    const filename = path.basename(file.filepath);
    const publicPath = `/uploads/${filename}`;

    const type = fields.type?.[0];
    const caption = fields.caption?.[0];
    const weight = fields.weight?.[0];
    const photo_date = fields.photo_date?.[0];

    // Update database based on type
    if (type === 'profile') {
      await pool.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [publicPath, user.userId]
      );
    } else if (type === 'progress') {
      await pool.query(
        'INSERT INTO progress_photos (user_id, photo_url, caption, weight, photo_date) VALUES (?, ?, ?, ?, ?)',
        [user.userId, publicPath, caption || null, weight || null, photo_date || new Date().toISOString().split('T')[0]]
      );
    }

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: publicPath
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}