const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/session');

// GET all Progress
router.get('/', SessionController.getAll);

// GET single Progress
router.get('/:id', SessionController.getSingle);

// POST create Progress
router.post('/', SessionController.createSession);

// put Update Progress
router.put('/:id', SessionController.updateSession);

// DELETE Progress
router.delete('/:id', SessionController.deleteSession);

module.exports = router;
