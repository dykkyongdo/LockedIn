# Database and API Integration

This document outlines the complete SQLite database setup and API integration for the LockedIn application.

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
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
);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  job_name TEXT NOT NULL,
  description TEXT NOT NULL,
  company_photo TEXT,
  location TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users (id) ON DELETE CASCADE
);
```

#### Interest Categories & Profile Tags
- `interest_categories` - Categories for job matching (Full Stack, ML, etc.)
- `profile_tags` - Personality tags (vibe coder, coffee addicted, etc.)
- Junction tables for many-to-many relationships

#### Swiping & Matching
- `applicant_swipes` - Records left/right swipes
- `matches` - Records when both parties swipe right
- `conversations` - Chat between matched users
- `messages` - Individual chat messages

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/interests` - Update user interests
- `PUT /api/profile/tags` - Update user profile tags

### Job Discovery
- `GET /api/jobs/discover` - Get jobs for swiping
- `POST /api/jobs/:jobId/swipe` - Swipe on a job (left/right)
- `GET /api/jobs/employer` - Get employer's jobs
- `POST /api/jobs/employer` - Create new job posting

### Reference Data
- `GET /api/reference/interest-categories/:major` - Get interest categories by major
- `GET /api/reference/profile-tags/:major` - Get profile tags by major

## 🔧 Implementation Details

### Server Setup
1. **Database Configuration** (`src/config/db.ts`)
   - SQLite3 with promisified methods
   - Automatic schema initialization
   - Sample data insertion

2. **Route Handlers**
   - `src/routes/auth.routes.ts` - Authentication
   - `src/routes/profile.routes.ts` - Profile management
   - `src/routes/jobs.routes.ts` - Job discovery and swiping
   - `src/routes/reference.routes.ts` - Reference data

3. **Middleware**
   - JWT token authentication
   - Role-based access control
   - Error handling

### Client Integration
1. **API Client** (`src/lib/api.ts`)
   - TypeScript interfaces for all data types
   - Authentication token management
   - Error handling and response parsing

2. **Updated Components**
   - `MainSeeking.tsx` - Real job data from API
   - `CreateProfile.tsx` - Resume parsing integration
   - `UserProfile.tsx` - Profile management

## 📊 Sample Data

### Interest Categories
**Computer Science (CMPT):**
- Full Stack, Back-end, Front-end, Mobile Development
- DevOps, Data Science, Machine Learning, AI
- Big Data, Cloud Computing, Cybersecurity, QA
- Game Development, Blockchain, IoT

**Business (BUS):**
- Business Analytics, Consulting, Finance, Marketing
- Operations Management, Project Management, Sales
- Human Resources, Supply Chain, Strategy
- Entrepreneurship, Real Estate, Healthcare Management

### Profile Tags
**Computer Science:**
- "vibe coder", "caffeine addicted", "sleep deprived"
- "terminal enjoyer", "leetcode grinder", "dark mode zealot"
- "docker enjoyer", "ml enjoyer", "night owl"

**Business:**
- "deck master", "spreadsheet ninja", "networking pro"
- "pitch perfect", "coffee chat enjoyer", "ops optimizer"
- "growth hacker", "kpi keeper", "people person"

### Sample Jobs
- Collabware Engineering - Junior Software Quality Engineer
- Offworld Industries - Co-Op Programmer
- Nokia - Full Stack Dev Cloud and ML Intern
- Redbrick - Software Developer (C++)
- Super Software - ML Engineer and Data Analyst

## 🔐 Security Features

1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Tokens** - Secure authentication
3. **Role-based Access** - Applicant vs Employer permissions
4. **Input Validation** - Server-side validation
5. **SQL Injection Protection** - Parameterized queries

## 🚀 Getting Started

### Server
```bash
cd server
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

### Database
The database is automatically initialized when the server starts. The SQLite file (`lockedin.db`) will be created in the server directory.

## 📝 Environment Variables

Create a `.env` file in the server directory:
```
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
PORT=3001
```

## 🔄 Data Flow

1. **User Registration/Login** → JWT token stored in localStorage
2. **Profile Creation** → Resume parsing + manual entry
3. **Job Discovery** → API fetches jobs excluding already swiped
4. **Swiping** → Records swipe direction, checks for matches
5. **Matching** → Creates conversation when both parties swipe right
6. **Messaging** → Real-time chat between matched users

## 🎯 Key Features Implemented

✅ SQLite database with complete schema
✅ JWT authentication system
✅ Resume parsing with OpenAI integration
✅ Job discovery and swiping
✅ Profile management
✅ Interest categories and personality tags
✅ Sample data for testing
✅ TypeScript type safety
✅ Error handling and validation
✅ Role-based access control

The application now has a complete backend with persistent data storage and a fully integrated frontend that communicates with the real API endpoints!
