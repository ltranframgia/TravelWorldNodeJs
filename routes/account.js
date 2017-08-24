var express = require('express');
var router = express.Router();

var account_controller = require('../controllers/accountController');

// POST
router.post('/login',  account_controller.login);

router.get('/logout',  account_controller.logout);

module.exports = router;
