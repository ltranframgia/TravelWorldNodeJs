var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/authController');

// Login
router.post('/login',  auth_controller.login);

// Logout
router.post('/logout',  auth_controller.isAuthenticated, auth_controller.logout);

// Token
router.post('/token', auth_controller.token);

module.exports = router;
