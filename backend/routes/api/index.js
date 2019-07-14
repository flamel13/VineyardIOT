const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/assets', require('./assets'));

module.exports = router;
