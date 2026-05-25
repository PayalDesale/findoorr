const express = require('express');
const router = express.Router();
const { suggestSlots } = require('../controllers/schedulingController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/scheduling/suggest?professor_id=X&date=YYYY-MM-DD
router.get('/suggest', protect, suggestSlots);

module.exports = router;
