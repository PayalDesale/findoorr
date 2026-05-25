const pool = require('../config/db');

// All possible time slots the app supports
const ALL_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:30', '16:00', '17:00', '17:30'
];

const SLOT_LABELS = {
  '09:00': '9:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
  '12:00': '12:00 PM', '14:00': '2:00 PM', '15:30': '3:30 PM',
  '16:00': '4:00 PM', '17:00': '5:00 PM', '17:30': '5:30 PM'
};

// Score a slot — lower score = better recommendation
function scoreSlot(slot, hour) {
  // Prefer morning slots (10–12), then afternoon (2–4)
  if (hour >= 10 && hour <= 12) return 1;
  if (hour >= 14 && hour <= 16) return 2;
  return 3;
}

const suggestSlots = async (req, res) => {
  const { professor_id, date } = req.query;
  const student_id = req.user.id;

  if (!professor_id || !date) {
    return res.status(400).json({ message: 'professor_id and date are required' });
  }

  try {
    // Get professor's existing meetings on this date (booked/approved slots)
    const profMeetings = await pool.query(
      `SELECT time FROM meetings 
       WHERE professor_id = $1 AND date = $2 AND status IN ('pending', 'approved')`,
      [professor_id, date]
    );

    // Get student's existing meetings on this date
    const studentMeetings = await pool.query(
      `SELECT time FROM meetings 
       WHERE student_id = $1 AND date = $2 AND status IN ('pending', 'approved')`,
      [student_id, date]
    );

    // Get professor's office hours preference
    const profData = await pool.query(
      `SELECT office_hours, status FROM users WHERE id = $1`,
      [professor_id]
    );

    const profBooked = new Set(
      profMeetings.rows.map(r => r.time?.substring(0, 5))
    );
    const studentBooked = new Set(
      studentMeetings.rows.map(r => r.time?.substring(0, 5))
    );

    // F* = F(professor) ∩ F(student) — slots free for BOTH
    const freeSlots = ALL_SLOTS.filter(slot => {
      return !profBooked.has(slot) && !studentBooked.has(slot);
    });

    // Score and rank slots, pick top 3
    const scored = freeSlots.map(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return { slot, label: SLOT_LABELS[slot], score: scoreSlot(slot, hour) };
    });

    scored.sort((a, b) => a.score - b.score);

    const top3 = scored.slice(0, 3);
    const remaining = scored.slice(3);

    res.json({
      suggested: top3.map(s => ({ time: s.slot, label: s.label, score: s.score })),
      other: remaining.map(s => ({ time: s.slot, label: s.label, score: s.score })),
      algorithm: 'F* = F(p) ∩ F(s) with preference scoring',
      total_free: freeSlots.length,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { suggestSlots };
