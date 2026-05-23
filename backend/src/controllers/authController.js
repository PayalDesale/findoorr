const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role, department } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, department',
      [name, email, hashedPassword, role, department || null]
    );
    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, department, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, getProfile };
