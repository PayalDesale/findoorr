const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all professors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, department, phone, status, location, created_at 
       FROM users 
       WHERE role = 'professor' 
       ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single professor
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, department, phone, status, location, created_at 
       FROM users WHERE id = $1 AND role = 'professor'`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Professor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE professor status
router.patch('/:id/status', async (req, res) => {
  const { status, location } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET status = $1, location = $2 WHERE id = $3 AND role = 'professor' RETURNING *`,
      [status, location, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;