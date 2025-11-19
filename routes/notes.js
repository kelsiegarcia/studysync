

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note');

// GET all note
router.get('/', noteController.getAll);

// GET single note
router.get('/:id', noteController.getSingle);

// POST create note
router.post('/', noteController.createNote);

// put Update note
router.put('/:id', noteController.updateNote);

// DELETE note
router.delete('/:id', noteController.deleteNote);

module.exports = router;
