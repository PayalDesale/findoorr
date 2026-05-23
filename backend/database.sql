-- Create database (run this in pgAdmin)
-- CREATE DATABASE findoorr;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'professor')) NOT NULL,
  department VARCHAR(100),
  room VARCHAR(50),
  status VARCHAR(20) DEFAULT 'free',
  office_hours JSONB,
  subjects TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  professor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  mode VARCHAR(20) CHECK (mode IN ('in-person', 'virtual')) DEFAULT 'in-person',
  purpose VARCHAR(100),
  note TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'rescheduled')) DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  professor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100),
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')) DEFAULT 'present',
  marked_at TIMESTAMP DEFAULT NOW()
);
