var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/authController');

// POST
router.post('/login',  auth_controller.login);

router.get('/logout',  auth_controller.logout);

module.exports = router;
