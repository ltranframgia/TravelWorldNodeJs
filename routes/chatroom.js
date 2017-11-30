var express = require('express');
var router = express.Router();

var chatroom_Controller = require('../controllers/chatroomController');
var auth_controller = require('../controllers/authController');

// POST create chatroom
router.post('/', auth_controller.isAuthenticated, chatroom_Controller.create_chatroom);

// GET list chatroom
router.get('/', auth_controller.isAuthenticated, chatroom_Controller.list_chatroom);


module.exports = router;
