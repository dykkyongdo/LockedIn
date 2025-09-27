import { Router } from 'express';
import { query } from '../config/db';

const router = Router();

// Get interest categories by major
router.get('/interest-categories/:major', async (req: any, res: any) => {
  try {
    const { major } = req.params;
    
    if (!['BUS', 'CMPT'].includes(major)) {
      return res.status(400).json({ error: 'Major must be BUS or CMPT' });
    }

    const categories = await query(`
      SELECT * FROM interest_categories WHERE major = ? ORDER BY name
    `, [major]);

    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile tags by major
router.get('/profile-tags/:major', async (req: any, res: any) => {
  try {
    const { major } = req.params;
    
    if (!['BUS', 'CMPT'].includes(major)) {
      return res.status(400).json({ error: 'Major must be BUS or CMPT' });
    }

    const tags = await query(`
      SELECT * FROM profile_tags WHERE major = ? ORDER BY name
    `, [major]);

    res.json(tags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
