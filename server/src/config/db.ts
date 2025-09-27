import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('./lockedin.db');

// Promisify the database methods for easier async/await usage
export const query = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database with schema
export const initDatabase = async () => {
  try {
    // Enable foreign keys
    await run('PRAGMA foreign_keys = ON');

    // Create users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('applicant', 'employer')),
        profile_picture TEXT,
        description TEXT,
        university TEXT,
        year_of_study INTEGER,
        graduated BOOLEAN DEFAULT FALSE,
        major TEXT CHECK (major IN ('BUS', 'CMPT')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create interest categories table
    await run(`
      CREATE TABLE IF NOT EXISTS interest_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        major TEXT NOT NULL CHECK (major IN ('BUS', 'CMPT')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create profile tags table
    await run(`
      CREATE TABLE IF NOT EXISTS profile_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        major TEXT NOT NULL CHECK (major IN ('BUS', 'CMPT')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create jobs table
    await run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employer_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        job_name TEXT NOT NULL,
        description TEXT NOT NULL,
        company_photo TEXT,
        location TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user interest categories junction table
    await run(`
      CREATE TABLE IF NOT EXISTS user_interest_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES interest_categories (id) ON DELETE CASCADE,
        UNIQUE(user_id, category_id)
      )
    `);

    // Create user profile tags junction table
    await run(`
      CREATE TABLE IF NOT EXISTS user_profile_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES profile_tags (id) ON DELETE CASCADE,
        UNIQUE(user_id, tag_id)
      )
    `);

    // Create job interest categories junction table
    await run(`
      CREATE TABLE IF NOT EXISTS job_interest_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES interest_categories (id) ON DELETE CASCADE,
        UNIQUE(job_id, category_id)
      )
    `);

    // Create applicant swipes table
    await run(`
      CREATE TABLE IF NOT EXISTS applicant_swipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
        UNIQUE(applicant_id, job_id)
      )
    `);

    // Create matches table
    await run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        applicant_id INTEGER NOT NULL,
        matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
        FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(job_id, applicant_id)
      )
    `);

    // Create conversations table
    await run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'closed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
        UNIQUE(applicant_id, job_id)
      )
    `);

    // Create messages table
    await run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Insert sample data
    await insertSampleData();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Insert comprehensive seed data
const insertSampleData = async () => {
  try {
    // Check if data already exists
    const userCount = await get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log('Sample data already exists, skipping...');
      return;
    }

    // Read and execute the seed SQL file
    const fs = require('fs');
    const path = require('path');
    const seedSQL = fs.readFileSync(path.join(__dirname, '../data/seed.sql'), 'utf8');
    
    // Split the SQL into individual statements and execute them
    const statements = seedSQL
      .split(';')
      .map((stmt: string) => stmt.trim())
      .filter((stmt: string) => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await run(statement);
        } catch (error: any) {
          // Skip errors for statements that might fail (like duplicate inserts)
          if (!error.message.includes('UNIQUE constraint failed')) {
            console.warn('Warning executing statement:', statement.substring(0, 50) + '...', error.message);
          }
        }
      }
    }

    console.log('Comprehensive seed data inserted successfully! 🎉');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};

export default db;
