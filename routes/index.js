
const express = require('express');
const router = express.Router();
const swaggerRouter = require('./swagger');

router.use('/api-docs', swaggerRouter);

module.exports = router;