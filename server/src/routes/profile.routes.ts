import { Router } from 'express';
import { query, run } from '../config/db';

const router = Router();

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Get current user profile
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const users = await query(`
      SELECT id, first_name, last_name, email, role, profile_picture, description,
             university, year_of_study, graduated, major, created_at
      FROM users WHERE id = ?
    `, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Get user's interest categories
    const interests = await query(`
      SELECT ic.id, ic.name
      FROM interest_categories ic
      JOIN user_interest_categories uic ON ic.id = uic.category_id
      WHERE uic.user_id = ?
    `, [req.user.id]);

    // Get user's profile tags
    const tags = await query(`
      SELECT pt.id, pt.name
      FROM profile_tags pt
      JOIN user_profile_tags upt ON pt.id = upt.tag_id
      WHERE upt.user_id = ?
    `, [req.user.id]);

    res.json({
      ...user,
      interests,
      tags
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req: any, res: any) => {
  try {
    const { first_name, last_name, description, profile_picture, university, year_of_study, graduated, major } = req.body;
    
    await run(`
      UPDATE users 
      SET first_name = ?, last_name = ?, description = ?, profile_picture = ?,
          university = ?, year_of_study = ?, graduated = ?, major = ?
      WHERE id = ?
    `, [first_name, last_name, description, profile_picture, university, year_of_study, graduated, major, req.user.id]);

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user interests
router.put('/interests', authenticateToken, async (req: any, res: any) => {
  try {
    const { interests } = req.body; // Array of interest category IDs

    // Delete existing interests
    await run('DELETE FROM user_interest_categories WHERE user_id = ?', [req.user.id]);

    // Add new interests
    if (interests && interests.length > 0) {
      for (const interestId of interests) {
        await run(`
          INSERT INTO user_interest_categories (user_id, category_id)
          VALUES (?, ?)
        `, [req.user.id, interestId]);
      }
    }

    res.json({ message: 'Interests updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile tags
router.put('/tags', authenticateToken, async (req: any, res: any) => {
  try {
    const { tags } = req.body; // Array of tag IDs

    // Delete existing tags
    await run('DELETE FROM user_profile_tags WHERE user_id = ?', [req.user.id]);

    // Add new tags
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        await run(`
          INSERT INTO user_profile_tags (user_id, tag_id)
          VALUES (?, ?)
        `, [req.user.id, tagId]);
      }
    }

    res.json({ message: 'Profile tags updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
