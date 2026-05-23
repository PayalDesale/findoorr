const express = require('express');
const router = express.Router();
const { getAllProfessors, getProfessorById, updateAvailability } = require('../controllers/professorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllProfessors);
router.get('/:id', protect, getProfessorById);
router.put('/availability', protect, updateAvailability);

module.exports = router;
