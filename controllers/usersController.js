let User = require('../models/user');
let bcrypt = require('bcrypt');
let responseJson = require('../models/responseJson');
let constant = require('../helpers/constants');

// Register
exports.create_user = function(req, res) {

    // get user
    let user = new User(req.body);
    let pwd = req.body.password;

    // validate
    if (!user.username ||
        !pwd ||
        !user.email) {

        // response
        let _responseJson = responseJson.ResponseJson;
        _responseJson.clear();
        _responseJson.status(true, constant.PARAM_REQUIRE, 'Bad request');
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
            let _responseJson = responseJson.ResponseJson;
            _responseJson.clear();
            _responseJson.status(true, constant.DUPLICATE_USERNAME_OR_MAIL, 'Account already exists.');
            res.status(409).json(_responseJson.render());
            return
        }

        newUser.hash_password = undefined;
        newUser.refresh_token = undefined;
        // response
        let _responseJson = responseJson.ResponseJson;
        _responseJson.clear();
        _responseJson.status(false, constant.SUCCESSS,'ok');
        _responseJson.data([newUser]);
        res.status(201).json(_responseJson.render());

    });

};

// Get list users
exports.update = function(req, res) {

    res.status(200).json(req.params);
};

// Get list users
exports.list_users = function(req, res) {

    // find
    User.find({}, { hash_password: false }, function(err, users) {

        let _responseJson = responseJson.ResponseJson
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

        let _responseJson = responseJson.ResponseJson
        _responseJson.clear()
        if (req.user) {
            req.user.hash_password = undefined;
            req.user.refresh_token = undefined;
            req.user.created_time_token = undefined;

            // response
            let _responseJson = responseJson.status.get(true, constant.SUCCESSS ,'ok');
            _responseJson.user = req.user;

            res.json(_responseJson);

        } else {
            _responseJson.status(true,'FAIL','get user error')
            res.status(200).json(_responseJson.render());
        }
};