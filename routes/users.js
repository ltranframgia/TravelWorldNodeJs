var express = require('express');
var router = express.Router();

var users_controller = require('../controllers/usersController');
var auth_controller = require('../controllers/authController');

// POST create user
router.post('/',  users_controller.create_user);

// PUT update user
router.put('/:userId', auth_controller.isAuthenticated, users_controller.update);

// GET list user
// router.get('/', auth_controller.isAuthenticated, users_controller.list_users);

// GET current user
router.get('/me', auth_controller.isAuthenticated, users_controller.me);

module.exports = router;
