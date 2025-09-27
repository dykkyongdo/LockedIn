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

// Get jobs for swiping (excluding already swiped jobs)
router.get('/discover', async (req: any, res: any) => {
  try {
    // For demo purposes, allow access without authentication
    // In production, you'd want to require authentication
    const jobs = await query(`
      SELECT j.*, u.first_name as employer_first_name, u.last_name as employer_last_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      ORDER BY j.created_at DESC
      LIMIT 20
    `);

    // Get interest categories for each job
    const jobsWithDetails = [];
    for (const job of jobs) {
      const interests = await query(`
        SELECT ic.name
        FROM interest_categories ic
        JOIN job_interest_categories jic ON ic.id = jic.category_id
        WHERE jic.job_id = ?
      `, [job.id]);

      jobsWithDetails.push({
        ...job,
        interests: interests.map((i: any) => i.name)
      });
    }

    res.json(jobsWithDetails);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Swipe on a job
router.post('/:jobId/swipe', async (req: any, res: any) => {
  try {
    const { jobId } = req.params;
    const { direction } = req.body; // 'left' or 'right'

    if (!['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'Direction must be left or right' });
    }

    // For demo purposes, simulate a 30% chance of match on right swipe
    let matched = false;
    if (direction === 'right') {
      matched = Math.random() < 0.3;
    }

    res.json({ 
      message: 'Swipe recorded successfully',
      matched,
      direction
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get employer's jobs
router.get('/employer', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can access this endpoint' });
    }

    const jobs = await query(`
      SELECT j.*, 
             COUNT(DISTINCT as_count.applicant_id) as swipe_count,
             COUNT(DISTINCT m.applicant_id) as match_count
      FROM jobs j
      LEFT JOIN applicant_swipes as_count ON j.id = as_count.job_id AND as_count.direction = 'right'
      LEFT JOIN matches m ON j.id = m.job_id
      WHERE j.employer_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `, [req.user.id]);

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job posting
router.post('/employer', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create jobs' });
    }

    const { company_name, job_name, description, company_photo, location, interests } = req.body;

    const result = await run(`
      INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.id, company_name, job_name, description, company_photo, location]);

    const jobId = result.lastID;

    // Add interest categories if provided
    if (interests && interests.length > 0) {
      for (const interestId of interests) {
        await run(`
          INSERT INTO job_interest_categories (job_id, category_id)
          VALUES (?, ?)
        `, [jobId, interestId]);
      }
    }

    res.status(201).json({
      id: jobId,
      message: 'Job created successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
