const express = require('express');

const router = express.Router();

router.use('/email', require('./email'));

module.exports = router;
