import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, run } from '../config/db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, university, year_of_study, graduated, major, description } = req.body;
    
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await run(`
      INSERT INTO users (first_name, last_name, email, password, role, university, year_of_study, graduated, major, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, email, hashedPassword, role, university, year_of_study, graduated, major, description]);

    const token = jwt.sign({ id: result.lastID, email, role }, JWT_SECRET);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.lastID, first_name, last_name, email, role }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
