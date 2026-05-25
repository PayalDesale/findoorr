const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const professorRoutes = require('./routes/professors');
const notificationRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: '🚀 Findoorr API running!', version: '1.0.0', college: 'MIT Academy of Engineering, Pune' }));
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const pool = require('./config/db');
const PORT = process.env.PORT || 5000;

pool.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    return pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'free';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(200) DEFAULT '';
    `);
  })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Findoorr API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    app.listen(PORT, () => console.log(`🚀 Findoorr API running on port ${PORT} (no DB)`));
  });