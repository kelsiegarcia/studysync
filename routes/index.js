const express = require('express');
const router = express.Router();


router.use('/api-docs', require('./swagger'));

module.exports = router;
