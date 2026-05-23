const pool = require('../config/db');

const requestMeeting = async (req, res) => {
  const { professor_id, date, time, duration, mode, purpose, note } = req.body;
  const student_id = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO meetings (student_id, professor_id, date, time, duration, mode, purpose, note, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
      [student_id, professor_id, date, time, duration, mode, purpose, note]
    );
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, 'meeting_request')`,
      [professor_id, 'New Meeting Request', `A student has requested a meeting on ${date} at ${time}`]
    );
    res.status(201).json({ message: 'Meeting requested successfully', meeting: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMeetings = async (req, res) => {
  const { role, id } = req.user;
  try {
    let query;
    if (role === 'student') {
      query = await pool.query(
        `SELECT m.*, u.name as professor_name, u.department 
         FROM meetings m JOIN users u ON m.professor_id = u.id 
         WHERE m.student_id = $1 ORDER BY m.date DESC`, [id]
      );
    } else {
      query = await pool.query(
        `SELECT m.*, u.name as student_name, u.email as student_email 
         FROM meetings m JOIN users u ON m.student_id = u.id 
         WHERE m.professor_id = $1 ORDER BY m.date DESC`, [id]
      );
    }
    res.json(query.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateMeetingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  try {
    const result = await pool.query(
      `UPDATE meetings SET status = $1, reason = $2, updated_at = NOW() WHERE id = $3 AND professor_id = $4 RETURNING *`,
      [status, reason, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Meeting not found' });
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, 'meeting_update')`,
      [result.rows[0].student_id, `Meeting ${status}`, `Your meeting request has been ${status}`]
    );
    res.json({ message: `Meeting ${status}`, meeting: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { requestMeeting, getMeetings, updateMeetingStatus };
