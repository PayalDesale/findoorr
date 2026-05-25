const pool = require('../config/db');

const getAllProfessors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, department, status 
       FROM users WHERE role = 'professor' ORDER BY name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProfessorById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, department, status, bio
       FROM users WHERE id = $1 AND role = 'professor'`, [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Professor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateAvailability = async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET status = $1, updated_at = NOW() 
       WHERE id = $2 RETURNING id, name, status`,
      [status, req.user.id]
    );
    res.json({ message: 'Availability updated', professor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllProfessors, getProfessorById, updateAvailability };