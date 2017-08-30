var express = require('express');
var router = express.Router();

var timeline_controller = require('../controllers/timelineController');
var auth_controller = require('../controllers/authController');

// POST create timeline
router.post('/', auth_controller.isAuthenticated, timeline_controller.create_timeline);

// GET list timeline
router.get('/', auth_controller.isAuthenticated, timeline_controller.list_timeline);

module.exports = router;
