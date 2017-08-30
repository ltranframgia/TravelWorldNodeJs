var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/authController');

// Login
router.post('/login',  auth_controller.login);

// Logout
router.post('/logout',  auth_controller.isAuthenticated, auth_controller.logout);

// refreshToken
router.get('/refresh_token',  auth_controller.refreshToken);

module.exports = router;
