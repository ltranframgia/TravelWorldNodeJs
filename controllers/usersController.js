let CONSTANT = require('../helpers/constants');
let JsonGenerator = require('../helpers/json-generator');
let User = require('../models/user');

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
        let _responseJson = JsonGenerator.status.get(false, CONSTANT.PARAM_REQUIRE ,'Bad request');
        res.status(400).json(_responseJson);

        return
    }

    // create hash pwd
    user.hash_password = user.createHashPassword(pwd);

    // save
    user.save(function (err, newUser) {

        if (err) {

            console.log(err);

            // response
            let _responseJson = JsonGenerator.status.get(false, CONSTANT.DUPLICATE_USERNAME_OR_MAIL ,'Account already exists.');
            res.status(409).json(_responseJson);
            return
        }

        newUser.hash_password = undefined;
        newUser.refresh_token = undefined;

        // response
        let _responseJson = JsonGenerator.status.get(true, CONSTANT.SUCCESSS ,'Ok');
        _responseJson.user = newUser;
        res.status(201).json(_responseJson);

    });

};

// Get list users
exports.update = function(req, res) {

    res.status(200).json(req.params);
};

// Get list users
exports.list_users = function(req, res) {

    // find
    User.find({}, { hash_password: false, refresh_token: false, created_time_token : false }, function(err, users) {

        if (users) {
            // response
            let _responseJson = JsonGenerator.status.get(true, CONSTANT.SUCCESSS ,'Ok');
            _responseJson.users = users;
            res.status(200).json(_responseJson);


        } else {
            // response
            let _responseJson = JsonGenerator.status.get(false, CONSTANT.FAILURE ,'get user error');
            res.status(200).json(_responseJson);
        }
    })
};

// Get me
exports.me = function(req, res) {

        if (req.user) {
            req.user.hash_password = undefined;
            req.user.refresh_token = undefined;
            req.user.created_time_token = undefined;

            // response
            let _responseJson = JsonGenerator.status.get(true, CONSTANT.SUCCESSS ,'Ok');
            _responseJson.user = req.user;
            res.status(200).json(_responseJson);

        } else {
            // response
            let _responseJson = JsonGenerator.status.get(true, CONSTANT.FAILURE ,'get user error');
            res.status(200).json(_responseJson);
        }
};