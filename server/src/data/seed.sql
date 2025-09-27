-- ================================
-- LOCKEDIN DATABASE SEED DATA
-- ================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ================================
-- CREATE TABLES (if they don't exist)
-- ================================

-- Create users table
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
);

-- Create interest categories table
CREATE TABLE IF NOT EXISTS interest_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  major TEXT NOT NULL CHECK (major IN ('BUS', 'CMPT')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create profile tags table
CREATE TABLE IF NOT EXISTS profile_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  major TEXT NOT NULL CHECK (major IN ('BUS', 'CMPT')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
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

-- Create user interest categories junction table
CREATE TABLE IF NOT EXISTS user_interest_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES interest_categories (id) ON DELETE CASCADE,
  UNIQUE(user_id, category_id)
);

-- Create user profile tags junction table
CREATE TABLE IF NOT EXISTS user_profile_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES profile_tags (id) ON DELETE CASCADE,
  UNIQUE(user_id, tag_id)
);

-- Create job interest categories junction table
CREATE TABLE IF NOT EXISTS job_interest_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES interest_categories (id) ON DELETE CASCADE,
  UNIQUE(job_id, category_id)
);

-- Create applicant swipes table
CREATE TABLE IF NOT EXISTS applicant_swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  UNIQUE(applicant_id, job_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE(job_id, applicant_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'closed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  UNIQUE(applicant_id, job_id)
);

-- Create messages table
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
);

-- ================================
-- CLEAR EXISTING DATA (for fresh start)
-- ================================
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM matches;
DELETE FROM applicant_swipes;
DELETE FROM job_interest_categories;
DELETE FROM user_interest_categories;
DELETE FROM user_profile_tags;
DELETE FROM jobs;
DELETE FROM users;
DELETE FROM interest_categories;
DELETE FROM profile_tags;

-- ================================
-- INTEREST CATEGORIES
-- ================================

-- CMPT (Computer Science) concentrations
INSERT INTO interest_categories (major, name) VALUES
('CMPT', 'Front-end'),
('CMPT', 'Back-end'),
('CMPT', 'Full Stack'),
('CMPT', 'ML'),
('CMPT', 'QA'),
('CMPT', 'Data Analysis'),
('CMPT', 'Big Data'),
('CMPT', 'Mobile'),
('CMPT', 'Web'),
('CMPT', 'DevOps'),
('CMPT', 'Cloud Computing'),
('CMPT', 'Cybersecurity'),
('CMPT', 'Game Development'),
('CMPT', 'Blockchain'),
('CMPT', 'IoT');

-- BUS (Business) concentrations
INSERT INTO interest_categories (major, name) VALUES
('BUS', 'Management'),
('BUS', 'Finance'),
('BUS', 'Marketing'),
('BUS', 'Human Resources (HR)'),
('BUS', 'Operations Management'),
('BUS', 'Business Analytics'),
('BUS', 'Consulting'),
('BUS', 'Project Management'),
('BUS', 'Sales'),
('BUS', 'Supply Chain'),
('BUS', 'Strategy'),
('BUS', 'Entrepreneurship'),
('BUS', 'Real Estate'),
('BUS', 'Healthcare Management'),
('BUS', 'International Business');

-- ================================
-- PROFILE TAGS
-- ================================

-- COMPUTER SCIENCE PROFILE TAGS
INSERT INTO profile_tags (major, name) VALUES
('CMPT', 'vibe-coder'),
('CMPT', 'hate to be outside'),
('CMPT', 'Caffeine addicted'),
('CMPT', 'League of Legends'),
('CMPT', 'Sleep deprived'),
('CMPT', '6ft7in'),
('CMPT', 'Celibate'),
('CMPT', '#opentowork'),
('CMPT', 'Tech bro'),
('CMPT', 'rm -rf'),
('CMPT', 'Debugging life'),
('CMPT', 'Bug farmer'),
('CMPT', 'Ramen diet'),
('CMPT', 'git push --force'),
('CMPT', 'terminal enjoyer'),
('CMPT', 'leetcode grinder'),
('CMPT', 'dark mode zealot'),
('CMPT', 'tab over spaces'),
('CMPT', 'vim curious'),
('CMPT', 'docker enjoyer'),
('CMPT', 'low-latency fiend'),
('CMPT', 'devops dabbler'),
('CMPT', 'gpu hungry'),
('CMPT', 'ml enjoyer'),
('CMPT', 'bug whisperer'),
('CMPT', 'night owl'),
('CMPT', 'api tinkerer'),
('CMPT', 'open source fan'),
('CMPT', 'pair programming pro');

-- BUSINESS PROFILE TAGS
INSERT INTO profile_tags (major, name) VALUES
('BUS', 'PowerPoint Picasso'),
('BUS', 'Ego powered'),
('BUS', 'Crypto startup'),
('BUS', 'Patagonia vest'),
('BUS', 'Networking'),
('BUS', 'InFlUeNcEr'),
('BUS', 'Freak in the sheets'),
('BUS', 'Jordan Belfort'),
('BUS', 'MBA is not a scam'),
('BUS', 'Finance bro'),
('BUS', 'deck master'),
('BUS', 'spreadsheet ninja'),
('BUS', 'networking pro'),
('BUS', 'pitch perfect'),
('BUS', 'coffee chat enjoyer'),
('BUS', 'ops optimizer'),
('BUS', 'market whisperer'),
('BUS', 'brand savvy'),
('BUS', 'finance curious'),
('BUS', 'ops hacksmith'),
('BUS', 'growth hacker'),
('BUS', 'kpi keeper'),
('BUS', 'sales sprinter'),
('BUS', 'analyst brain'),
('BUS', 'pm in training'),
('BUS', 'case crack addict'),
('BUS', 'marketing mind'),
('BUS', 'gantt guru'),
('BUS', 'people person'),
('BUS', 'scrum friendly');

-- ================================
-- USERS (APPLICANTS & EMPLOYERS)
-- ================================

-- Sample applicants
INSERT INTO users (first_name, last_name, email, password, role, university, year_of_study, graduated, major, description, created_at) VALUES
('Alice', 'Johnson', 'alice.johnson@example.com', '$2b$10$dummy', 'applicant', 'University of British Columbia', 4, 0, 'CMPT', 'Aspiring data scientist with a passion for machine learning and AI. Love solving complex problems and building innovative solutions.', CURRENT_TIMESTAMP),
('Bob', 'Smith', 'bob.smith@example.com', '$2b$10$dummy', 'applicant', 'Simon Fraser University', 3, 0, 'CMPT', 'Full-stack developer who enjoys creating seamless user experiences. Passionate about clean code and modern web technologies.', CURRENT_TIMESTAMP),
('Carol', 'Davis', 'carol.davis@example.com', '$2b$10$dummy', 'applicant', 'University of Victoria', 2, 0, 'CMPT', 'Mobile app developer with a focus on iOS and Android. Love creating intuitive interfaces and optimizing app performance.', CURRENT_TIMESTAMP),
('David', 'Wilson', 'david.wilson@example.com', '$2b$10$dummy', 'applicant', 'University of British Columbia', 5, 1, 'CMPT', 'Recent CS graduate specializing in cybersecurity and cloud computing. Excited to start my career in tech security.', CURRENT_TIMESTAMP),
('Emma', 'Brown', 'emma.brown@example.com', '$2b$10$dummy', 'applicant', 'University of Toronto', 3, 0, 'BUS', 'Business student with a passion for marketing and digital strategy. Love analyzing consumer behavior and creating impactful campaigns.', CURRENT_TIMESTAMP),
('Frank', 'Miller', 'frank.miller@example.com', '$2b$10$dummy', 'applicant', 'York University', 4, 0, 'BUS', 'Finance major with strong analytical skills. Interested in investment banking and financial modeling.', CURRENT_TIMESTAMP),
('Grace', 'Taylor', 'grace.taylor@example.com', '$2b$10$dummy', 'applicant', 'McGill University', 2, 0, 'BUS', 'Operations management student who loves optimizing processes and improving efficiency. Passionate about supply chain management.', CURRENT_TIMESTAMP),
('Henry', 'Anderson', 'henry.anderson@example.com', '$2b$10$dummy', 'applicant', 'University of Alberta', 3, 0, 'BUS', 'Consulting enthusiast with experience in business analysis. Love solving complex business problems and working with diverse teams.', CURRENT_TIMESTAMP);

-- Sample employers
INSERT INTO users (first_name, last_name, email, password, role, university, major, description, created_at) VALUES
('Sarah', 'Chen', 'sarah.chen@collabware.com', '$2b$10$dummy', 'employer', 'Stanford University', 'CMPT', 'Engineering Manager at Collabware Engineering. Passionate about building great products and mentoring talented developers.', CURRENT_TIMESTAMP),
('Mike', 'Rodriguez', 'mike.rodriguez@offworld.com', '$2b$10$dummy', 'employer', 'MIT', 'CMPT', 'Lead Developer at Offworld Industries. Gaming industry veteran with 10+ years of experience in multiplayer game development.', CURRENT_TIMESTAMP),
('Lisa', 'Wang', 'lisa.wang@nokia.com', '$2b$10$dummy', 'employer', 'University of Waterloo', 'CMPT', 'Senior Software Architect at Nokia. Expert in cloud technologies and machine learning applications.', CURRENT_TIMESTAMP),
('James', 'Thompson', 'james.thompson@redbrick.com', '$2b$10$dummy', 'employer', 'Carnegie Mellon', 'CMPT', 'Principal Engineer at Redbrick. C++ specialist with extensive experience in browser development and performance optimization.', CURRENT_TIMESTAMP),
('Maria', 'Garcia', 'maria.garcia@super.com', '$2b$10$dummy', 'employer', 'UC Berkeley', 'CMPT', 'Data Science Director at Super Software. Leading ML initiatives and building data-driven products.', CURRENT_TIMESTAMP),
('John', 'Lee', 'john.lee@trail.com', '$2b$10$dummy', 'employer', 'Wharton School', 'BUS', 'Business Intelligence Manager at Trail Appliances. Expert in data analytics and business process optimization.', CURRENT_TIMESTAMP),
('Jennifer', 'White', 'jennifer.white@ubc.ca', '$2b$10$dummy', 'employer', 'Harvard Business School', 'BUS', 'Strategic Planning Director at UBC. Leading digital transformation initiatives in higher education.', CURRENT_TIMESTAMP),
('Robert', 'Kim', 'robert.kim@globalrelay.com', '$2b$10$dummy', 'employer', 'INSEAD', 'BUS', 'Senior Business Analyst at Global Relay. Specializing in financial services and regulatory compliance.', CURRENT_TIMESTAMP),
('Amanda', 'Clark', 'amanda.clark@eldorado.com', '$2b$10$dummy', 'employer', 'London Business School', 'BUS', 'Financial Reporting Director at Eldorado Gold. CPA with expertise in mining industry financial reporting.', CURRENT_TIMESTAMP),
('Kevin', 'Martinez', 'kevin.martinez@unite.com', '$2b$10$dummy', 'employer', 'Kellogg School', 'BUS', 'Marketing Director at Unite Capital Partners. Real estate marketing expert with 15+ years of experience.', CURRENT_TIMESTAMP);

-- ================================
-- JOBS
-- ================================

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(9, 'Collabware Engineering', 'Junior Software Quality Engineer',
 'Looking for a curious, detail-oriented match who loves breaking things (on purpose) and making them better. Swipe right if you''re ready to test, tinker, and team up to keep our code bug-free and lovable.',
 NULL, 'Burnaby, 4km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(10, 'Offworld Industries', 'Co-Op Programmer',
 '🚀 Seeking a talented Co-Op Programmer who loves crafting seamless multiplayer experiences and playing nicely with Unreal Engine. Swipe right if you''re ready to code, optimize, and squad up for epic PvP and PvE adventures 🎮💖',
 NULL, 'New Westminster, 6km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(11, 'Nokia', 'Full Stack Dev Cloud and ML Intern',
 '💖 Seeking a curious code soulmate ready to build cloud-native magic and AI/ML adventures together 🌥️💻. Swipe right if you love Java, Python, or Golang, dream in Kubernetes, and want to grow side by side in innovation and heart ❤️✨.',
 NULL, 'Bogota, 999+ km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(12, 'Redbrick', 'Software Developer (C++)',
 '💖 Looking for a curious C++ adventurer ready to dive into the world''s largest browser codebase and craft features that wow 🌐✨. Say yes if you love solving complex bugs, designing sleek features, and collaborating on a team that''s equal parts fun and fearless 💻❤️.',
 NULL, 'Victoria, 200km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(13, 'Super Software', 'ML Engineer and Data Analyst',
 '🤖 Looking for a data-loving partner who dreams in Python and dances with machine learning models 💻💖. Match me if you''re ready to uncover insights, train smart algorithms, and build AI magic together, one dataset at a time ✨📊.',
 NULL, 'Richmond, 15km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(14, 'Trail Appliances Ltd.', 'Business Intelligence Data Specialist',
 '🔍 Searching for a data-driven partner who loves uncovering insights and optimizing processes. Let''s transform raw data into actionable intelligence and make business decisions smarter together! 💡📊',
 NULL, 'Richmond, BC – 15 km from Vancouver');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(15, 'University of British Columbia (UBC)', 'Business Analyst',
 '📈 Seeking a strategic thinker to analyze systems and data sources, gathering requirements to enhance business operations. Together, we''ll drive efficiency and innovation at one of Canada''s leading educational institutions! 🎓💼',
 NULL, 'Vancouver, 15km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(16, 'Global Relay', 'Business Analyst Lead',
 '💼 Ready to lead complex business analysis and process improvement initiatives? Join us in a hybrid role where your expertise will shape the future of our services and drive operational excellence. Let''s achieve greatness together! 🌟📈',
 NULL, 'Vancouver, 6km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(17, 'Eldorado Gold', 'Director, Financial Reporting',
 '💰 Seeking a financial expert to translate complex data into actionable insights, empowering executives with reliable information for strategic planning. Let''s navigate the world of finance and make impactful decisions together! 📊💼',
 NULL, 'Vancouver, 5km away');

INSERT INTO jobs (employer_id, company_name, job_name, description, company_photo, location) VALUES
(18, 'Unite Capital Partners', 'Real Estate Operations & Marketing Lead',
 '🏡 Looking for a dynamic individual to oversee real estate operations and marketing strategies. Together, we''ll develop and execute multi-channel marketing plans, enhancing brand presence and driving business growth. Let''s build success side by side! 🏢📣',
 NULL, 'Vancouver, 8km away');

-- ================================
-- JOB INTEREST CATEGORIES
-- ================================

-- Collabware Engineering - QA Engineer
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(1, (SELECT id FROM interest_categories WHERE name = 'QA' AND major = 'CMPT')),
(1, (SELECT id FROM interest_categories WHERE name = 'Data Analysis' AND major = 'CMPT'));

-- Offworld Industries - Co-Op Programmer
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(2, (SELECT id FROM interest_categories WHERE name = 'Back-end' AND major = 'CMPT')),
(2, (SELECT id FROM interest_categories WHERE name = 'QA' AND major = 'CMPT'));

-- Nokia - Full Stack Dev Cloud and ML Intern
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(3, (SELECT id FROM interest_categories WHERE name = 'ML' AND major = 'CMPT')),
(3, (SELECT id FROM interest_categories WHERE name = 'Full Stack' AND major = 'CMPT')),
(3, (SELECT id FROM interest_categories WHERE name = 'Big Data' AND major = 'CMPT'));

-- Redbrick - Software Developer (C++)
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(4, (SELECT id FROM interest_categories WHERE name = 'Back-end' AND major = 'CMPT'));

-- Super Software - ML Engineer and Data Analyst
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(5, (SELECT id FROM interest_categories WHERE name = 'ML' AND major = 'CMPT')),
(5, (SELECT id FROM interest_categories WHERE name = 'Data Analysis' AND major = 'CMPT')),
(5, (SELECT id FROM interest_categories WHERE name = 'Big Data' AND major = 'CMPT'));

-- Trail Appliances - Business Intelligence Data Specialist
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(6, (SELECT id FROM interest_categories WHERE name = 'Business Analytics' AND major = 'BUS')),
(6, (SELECT id FROM interest_categories WHERE name = 'Operations Management' AND major = 'BUS'));

-- UBC - Business Analyst
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(7, (SELECT id FROM interest_categories WHERE name = 'Business Analytics' AND major = 'BUS')),
(7, (SELECT id FROM interest_categories WHERE name = 'Consulting' AND major = 'BUS'));

-- Global Relay - Business Analyst Lead
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(8, (SELECT id FROM interest_categories WHERE name = 'Business Analytics' AND major = 'BUS')),
(8, (SELECT id FROM interest_categories WHERE name = 'Consulting' AND major = 'BUS'));

-- Eldorado Gold - Director, Financial Reporting
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(9, (SELECT id FROM interest_categories WHERE name = 'Finance' AND major = 'BUS')),
(9, (SELECT id FROM interest_categories WHERE name = 'Consulting' AND major = 'BUS'));

-- Unite Capital Partners - Real Estate Operations & Marketing Lead
INSERT INTO job_interest_categories (job_id, category_id) VALUES
(10, (SELECT id FROM interest_categories WHERE name = 'Marketing' AND major = 'BUS')),
(10, (SELECT id FROM interest_categories WHERE name = 'Operations Management' AND major = 'BUS'));

-- ================================
-- USER INTEREST CATEGORIES (Sample)
-- ================================

-- Alice Johnson (CMPT) - interested in ML and Data Analysis
INSERT INTO user_interest_categories (user_id, category_id) VALUES
(1, (SELECT id FROM interest_categories WHERE name = 'ML' AND major = 'CMPT')),
(1, (SELECT id FROM interest_categories WHERE name = 'Data Analysis' AND major = 'CMPT')),
(1, (SELECT id FROM interest_categories WHERE name = 'Big Data' AND major = 'CMPT'));

-- Bob Smith (CMPT) - interested in Full Stack and Web
INSERT INTO user_interest_categories (user_id, category_id) VALUES
(2, (SELECT id FROM interest_categories WHERE name = 'Full Stack' AND major = 'CMPT')),
(2, (SELECT id FROM interest_categories WHERE name = 'Web' AND major = 'CMPT')),
(2, (SELECT id FROM interest_categories WHERE name = 'Front-end' AND major = 'CMPT'));

-- Emma Brown (BUS) - interested in Marketing and Business Analytics
INSERT INTO user_interest_categories (user_id, category_id) VALUES
(5, (SELECT id FROM interest_categories WHERE name = 'Marketing' AND major = 'BUS')),
(5, (SELECT id FROM interest_categories WHERE name = 'Business Analytics' AND major = 'BUS'));

-- Frank Miller (BUS) - interested in Finance and Consulting
INSERT INTO user_interest_categories (user_id, category_id) VALUES
(6, (SELECT id FROM interest_categories WHERE name = 'Finance' AND major = 'BUS')),
(6, (SELECT id FROM interest_categories WHERE name = 'Consulting' AND major = 'BUS'));

-- ================================
-- USER PROFILE TAGS (Sample)
-- ================================

-- Alice Johnson - ML enthusiast tags
INSERT INTO user_profile_tags (user_id, tag_id) VALUES
(1, (SELECT id FROM profile_tags WHERE name = 'ml enjoyer' AND major = 'CMPT')),
(1, (SELECT id FROM profile_tags WHERE name = 'data whisperer' AND major = 'CMPT')),
(1, (SELECT id FROM profile_tags WHERE name = 'python lover' AND major = 'CMPT'));

-- Bob Smith - Full-stack developer tags
INSERT INTO user_profile_tags (user_id, tag_id) VALUES
(2, (SELECT id FROM profile_tags WHERE name = 'vibe-coder' AND major = 'CMPT')),
(2, (SELECT id FROM profile_tags WHERE name = 'Caffeine addicted' AND major = 'CMPT')),
(2, (SELECT id FROM profile_tags WHERE name = 'Sleep deprived' AND major = 'CMPT'));

-- Emma Brown - Marketing enthusiast tags
INSERT INTO user_profile_tags (user_id, tag_id) VALUES
(5, (SELECT id FROM profile_tags WHERE name = 'brand savvy' AND major = 'BUS')),
(5, (SELECT id FROM profile_tags WHERE name = 'marketing mind' AND major = 'BUS')),
(5, (SELECT id FROM profile_tags WHERE name = 'people person' AND major = 'BUS'));

-- Frank Miller - Finance bro tags
INSERT INTO user_profile_tags (user_id, tag_id) VALUES
(6, (SELECT id FROM profile_tags WHERE name = 'Finance bro' AND major = 'BUS')),
(6, (SELECT id FROM profile_tags WHERE name = 'spreadsheet ninja' AND major = 'BUS')),
(6, (SELECT id FROM profile_tags WHERE name = 'Jordan Belfort' AND major = 'BUS'));

-- ================================
-- SAMPLE SWIPES (for demo purposes)
-- ================================

-- Alice swiped right on ML jobs
INSERT INTO applicant_swipes (applicant_id, job_id, direction) VALUES
(1, 3, 'right'), -- Nokia ML Intern
(1, 5, 'right'); -- Super Software ML Engineer

-- Bob swiped right on Full Stack jobs
INSERT INTO applicant_swipes (applicant_id, job_id, direction) VALUES
(2, 3, 'right'), -- Nokia Full Stack
(2, 1, 'left');  -- Collabware QA (not interested)

-- Emma swiped right on Business jobs
INSERT INTO applicant_swipes (applicant_id, job_id, direction) VALUES
(5, 7, 'right'), -- UBC Business Analyst
(5, 8, 'right'); -- Global Relay Business Analyst

-- ================================
-- SAMPLE MATCHES
-- ================================

-- Alice matched with Nokia (30% chance worked)
INSERT INTO matches (job_id, applicant_id) VALUES
(3, 1);

-- Emma matched with UBC
INSERT INTO matches (job_id, applicant_id) VALUES
(7, 5);

-- ================================
-- SAMPLE CONVERSATIONS
-- ================================

INSERT INTO conversations (applicant_id, job_id, status) VALUES
(1, 3, 'matched'),
(5, 7, 'matched');

-- ================================
-- SAMPLE MESSAGES
-- ================================

INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES
(1, 1, 11, 'Hi! I''m really excited about the ML internship opportunity at Nokia. I''ve been working on several machine learning projects and would love to discuss how I can contribute to your cloud-native initiatives.'),
(1, 11, 1, 'Hello Alice! Thanks for your interest. Your background in ML looks impressive. We''d love to schedule an interview to discuss the role further. Are you available next week?'),
(2, 5, 15, 'Hi! I''m very interested in the Business Analyst position at UBC. I''m passionate about driving efficiency and innovation in educational institutions.'),
(2, 15, 5, 'Hello Emma! We''re excited about your interest in the role. Your experience in business analysis would be a great fit for our team. Let''s set up a call to discuss the position in more detail.');

-- ================================
-- COMPLETION MESSAGE
-- ================================
SELECT 'Database seeded successfully! 🎉' as message;
