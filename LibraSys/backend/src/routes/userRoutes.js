// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-2fa', userController.verify2FA);
router.post('/resend-2fa', userController.resend2FA);

module.exports = router;
