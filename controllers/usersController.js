var User = require('../models/user');
var bcrypt = require('bcrypt');
var responseJson = require('../models/responseJson');
var constant = require('../helpers/constants');

// Register
exports.create_user = function(req, res) {

    // get user
    var user = new User(req.body);
    var pwd = req.body.password

    // validate
    if (!user.username ||
        !pwd ||
        !user.email) {

        // response
        var _responseJson = responseJson.ResponseJson
        _responseJson.clear()
        _responseJson.status(true, constant.PARAM_REQUIRE, 'Bad request')
        res.status(400).json(_responseJson.render());
        return
    }

    // create hash pwd
    user.hash_password = bcrypt.hashSync(pwd, 10);

    // save
    user.save(function (err, newUser) {

        if (err) {

            console.log(err);

            // response
            var _responseJson = responseJson.ResponseJson
            _responseJson.clear()
            _responseJson.status(true, constant.DUPLICATE_USERNAME_OR_MAIL, 'Account already exists.')
            res.status(409).json(_responseJson.render());
            return
        }

        newUser.hash_password = undefined
        // response
        var _responseJson = responseJson.ResponseJson
        _responseJson.clear()
        _responseJson.status(false, constant.SUCCESSS,'ok')
        _responseJson.data([newUser])
        res.status(201).json(_responseJson.render());

    });

};


// Get list users
exports.list_users = function(req, res) {

    // find
    User.find({}, function(err, users) {

        var _responseJson = responseJson.ResponseJson
        _responseJson.clear()
        if (users) {
            _responseJson.status(false, 'SUCCESSS','get list users')
            _responseJson.data(users)
            res.status(200).json(_responseJson.render());
        } else {
            _responseJson.status(true,'FAIL','get user error')
            res.status(200).json(_responseJson.render());
        }
    })
};

// Get me
exports.me = function(req, res) {

        var _responseJson = responseJson.ResponseJson
        _responseJson.clear()
        if (req.user) {
            req.user.hash_password = undefined
            _responseJson.status(false, 'SUCCESSS','ok')
            _responseJson.data(req.user)
            res.status(200).json(_responseJson.render());
        } else {
            _responseJson.status(true,'FAIL','get user error')
            res.status(200).json(_responseJson.render());
        }
};