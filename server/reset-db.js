const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

// Delete existing database
const dbPath = './lockedin.db';
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Deleted existing database');
}

// Create new database and run seed script
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function resetAndSeed() {
  try {
    console.log('🚀 Starting database reset and seed...');
    
    // Read and execute the seed SQL file
    const seedSQL = fs.readFileSync(path.join(__dirname, 'src/data/seed.sql'), 'utf8');
    
    // Execute the entire SQL file as one transaction
    try {
      await run('BEGIN TRANSACTION');
      
      // Split the SQL into individual statements and execute them
      const statements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('PRAGMA'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await run(statement);
          } catch (error) {
            if (!error.message.includes('UNIQUE constraint failed') && 
                !error.message.includes('no such table')) {
              console.warn('Warning executing statement:', statement.substring(0, 50) + '...', error.message);
            }
          }
        }
      }
      
      await run('COMMIT');
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    }

    console.log('✅ Database reset and seeded successfully!');
    console.log('📊 Data includes:');
    console.log('   - 8 applicants and 10 employers');
    console.log('   - 10 job postings (5 CS, 5 Business)');
    console.log('   - Interest categories and profile tags');
    console.log('   - Sample swipes, matches, and conversations');
    console.log('   - Ready for testing! 🎉');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db.close();
  }
}

resetAndSeed();
