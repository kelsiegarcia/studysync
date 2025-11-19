
const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress');

// GET all Progress
router.get('/', ProgressController.getAll);

// GET single Progress
router.get('/:id', ProgressController.getSingle);

// POST create Progress
router.post('/', ProgressController.createProgress);

// put Update Progress
router.put('/:id', ProgressController.updateProgress);

// DELETE Progress
router.delete('/:id', ProgressController.deleteProgress);

module.exports = router;
