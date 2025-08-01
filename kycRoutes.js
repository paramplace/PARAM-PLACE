const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const authMiddleware = require('../middleware/auth');

router.post('/verify', authMiddleware, kycController.verifyFace);

module.exports = router;