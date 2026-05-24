const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
  const { name, email, password, role, department, phone, firebase_uid } = req.body;
  try {
    // Check if user already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      // Update firebase_uid if user exists
      await pool.query('UPDATE users SET firebase_uid = $1 WHERE email = $2', [firebase_uid, email]);
      return res.status(200).json({ message: 'User already exists, updated', user: existing.rows[0] });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, department, phone, firebase_uid, status, location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'free', '') 
       RETURNING id, name, email, role, department`,
      [name, email, hashedPassword, role, department || '', phone || '', firebase_uid || '']
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'findoorr_secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

router.post('/register', register);
router.post('/login', login);

module.exports = router;