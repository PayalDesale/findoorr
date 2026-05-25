const express = require('express');
const router = express.Router();
const { getAllProfessors, getProfessorById, updateAvailability } = require('../controllers/professorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllProfessors);
router.get('/:id', getProfessorById);
router.put('/availability', protect, updateAvailability);

module.exports = router;
