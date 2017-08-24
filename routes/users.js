var express = require('express');
var router = express.Router();

var users_controller = require('../controllers/usersController');

// GET current user
router.get('/', users_controller.users);

module.exports = router;
