const express = require('express');
const router = express.Router();
const { requestMeeting, getMeetings, updateMeetingStatus } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, requestMeeting);
router.get('/', protect, getMeetings);
router.put('/:id', protect, updateMeetingStatus);

module.exports = router;
