let Config = require('../helpers/config');
let CONSTANT = require('../helpers/constants');
let CODE = require('../helpers/status-code');
let JsonGenerator = require('../helpers/json-generator');
let jwt = require('jsonwebtoken');
let User = require('../models/user');

// login
exports.login = function(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    // validate
    if (!username ||
        !password) {

        // response
        let _responseJson = JsonGenerator.status.requireParameters();
        res.status(400).json(_responseJson);

        return
    }

    // find
    User.findOne({
        'username': username
    }, function(err, user) {

        if (!user) {
            // response
            let _responseJson = JsonGenerator.status.failure(CODE.NOT_FOUND, 'User is not exist');
            res.status(200).json(_responseJson);

        } else if (user &&
            user.comparePassword(password)) {

            let now = new Date();
            let currentTime = now.getTime();

            let payloadAccess = { username: user.username , createdTime: currentTime};
            let payloadRefresh = { username: user.username, id: user._id, createdTime: currentTime };

            let jwtAccessToken = jwt.sign(payloadAccess, Config.jwtSecret);
            let jwtRefreshToken = jwt.sign(payloadRefresh, Config.jwtSecret);

            // set to user
            user.refresh_token =  jwtRefreshToken;
            user.created_time_token =  currentTime;

            // save
            user.save(function (err, newUser) {

                if (err) {
                    // response
                    let _responseJson = JsonGenerator.status.updateDbError();
                    res.status(409).json(_responseJson);
                    return;
                }

                // data
                let data = {access_token: jwtAccessToken, refresh_token: jwtRefreshToken, token_type: "Bearer"};

                // response
                let _responseJson = JsonGenerator.status.success(undefined,'Login ok');
                _responseJson.token = data;
                res.status(200).json(_responseJson);
            });
        } else {
            // response
            let _responseJson = JsonGenerator.status.failure(CODE.WRONG_USERNAME_OR_PASSWORD, 'Login Error');
            res.status(200).json(_responseJson);
        }
    })
};


exports.logout = function(req, res) {

    if (req.user) {

        // set to user
        req.user.refresh_token =  undefined;
        req.user.created_time_token =  undefined;

        // save
        req.user.save(function (err, newUser) {

            if (err) {
                // response
                let _responseJson = JsonGenerator.status.updateDbError();
                res.status(409).json(_responseJson);
                return;
            }

            // response
            let _responseJson = JsonGenerator.status.success();
            res.status(200).json(_responseJson);
        });



    } else {
        // response
        let _responseJson = JsonGenerator.status.error();
        res.status(200).json(_responseJson);
    }

};

exports.isAuthenticated = function(req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        let jwtToken =  req.headers.authorization.split(' ')[1];
        jwt.verify(jwtToken, Config.jwtSecret, function(err, payload) {

            if (err) {
                let _responseJson = JsonGenerator.status.unauthorized();
                res.status(401).json(_responseJson);
            } else {

                // check time expried
                let now = new Date();
                let currentTime = now.getTime();
                let createdTime = payload.createdTime;
                let differTime = (currentTime - createdTime) / 1000;

                if (differTime > CONSTANT.ACCESS_TIMEOUT ) {
                    let _responseJson = JsonGenerator.status.unauthorized();
                    res.status(401).json(_responseJson);
                    return;
                }

                // get user
                let username = payload.username;

                // find
                User.findOne({
                    'username': username
                }, function(err, user) {

                    if (user &&
                        user.created_time_token === createdTime.toString()) {
                        req.user = user;
                        next();

                    } else {
                        let _responseJson = JsonGenerator.status.unauthorized();
                        res.status(401).json(_responseJson);
                    }
                })
            }

        });
    } else {
        let _responseJson = JsonGenerator.status.unauthorized();
        res.status(401).json(_responseJson);

    }
};

exports.token = function(req, res, next) {

    let grant_type = req.body.grant_type;

    if (grant_type === "refresh_token") {

        let refreshToken = req.body.refresh_token;

        jwt.verify(refreshToken, Config.jwtSecret, function(err, payload) {

            if (err) {
                let _responseJson = JsonGenerator.status.unauthorized();
                res.status(401).json(_responseJson);
            } else {

                let username = payload.username;

                // find
                User.findOne({
                    'username': username
                }, function(err, user) {

                    if (user &&
                        user.refresh_token === refreshToken) {

                        let now = new Date();
                        let currentTime = now.getTime();

                        let payloadAccess = { username: user.username , createdTime: currentTime};
                        let payloadRefresh = { username: user.username, email: user.email, createdTime: currentTime };

                        let jwtAccessToken = jwt.sign(payloadAccess, Config.jwtSecret);
                        let jwtRefreshToken = jwt.sign(payloadRefresh, Config.jwtSecret);

                        // set to user
                        user.refresh_token =  jwtRefreshToken;
                        user.created_time_token =  currentTime;

                        // save
                        user.save(function (err, newUser) {

                            if (err) {
                                // response
                                let _responseJson = JsonGenerator.status.updateDbError();
                                res.status(409).json(_responseJson);
                                return;
                            }

                            // data
                            let data = {access_token: jwtAccessToken, refresh_token: jwtRefreshToken, token_type: "Bearer"};

                            // response
                            let _responseJson = JsonGenerator.status.success();
                            _responseJson.token = data;

                            res.json(_responseJson);
                        });


                    } else {
                        let _responseJson = JsonGenerator.status.unauthorized();
                        res.status(401).json(_responseJson);
                    }
                })
            }

        });
    } else {
        let _responseJson = JsonGenerator.status.unauthorized();
        res.status(401).json(_responseJson);
    }

};

