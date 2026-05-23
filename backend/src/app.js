const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const professorRoutes = require('./routes/professors');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'https://findoorr-app.vercel.app'] }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: '🚀 Findoorr API running!', version: '1.0.0' }));
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Findoorr API running on port ${PORT}`));
