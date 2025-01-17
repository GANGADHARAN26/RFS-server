const express = require('express');
const router = express.Router();
const { 
  createCandidate, 
  getCandidates, 
  updateCandidate, 
  deleteCandidate 
} = require('../controllers/candidate');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all candidate routes

// Only HR and ADMIN can create candidates
router.route('/')
  .post(authorize('HR', 'ADMIN'), createCandidate)
  .get(getCandidates);

router.route('/:id')
  .put(authorize('HR', 'ADMIN'), updateCandidate)
  .delete(authorize('HR', 'ADMIN'), deleteCandidate);

module.exports = router; 