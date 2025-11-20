const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user');

// GET all users
router.get('/', usersController.getAllUsers);

// GET single user
router.get('/:id', usersController.getUserById);

// DELETE user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
