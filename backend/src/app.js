const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const notificationRoutes = require('./routes/notifications');
const professorRoutes = require('./routes/professors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/professors', professorRoutes);

app.get('/', (req, res) => res.json({ message: '🚀 Findoorr API running!', version: '1.0.0', college: 'MIT Academy of Engineering, Pune' }));

const PORT = process.env.PORT || 5000;

const pool = require('./config/db');

pool.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    // Add missing columns if they don't exist
    return pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'free';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(200) DEFAULT '';
    `);
  })
  .then(() => {
    console.log('✅ Database schema updated');
    app.listen(PORT, () => console.log(`🚀 Findoorr API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    // Start server anyway
    app.listen(PORT, () => console.log(`🚀 Findoorr API running on port ${PORT} (no DB)`));
  });