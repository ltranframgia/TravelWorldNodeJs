let User = require('../models/user');
let config = require('../helpers/config');
let constant = require('../helpers/constants');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let responseJson = require('../models/responseJson');

// login
exports.login = function(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    console.log('New user: ' + username + ' ' + password );
    // find
    User.findOne({
        'username': username
    }, function(err, user) {

        if (!user) {
            // response
            let _responseJson = responseJson.status.get(false, constant.FAILURE ,'User is not exist');

            res.json(_responseJson);

        } else if (user &&
            user.comparePassword(password)) {

            let now = new Date();
            let currentTime = now.getTime();
            console.log('Time: ' + currentTime + ' ' + user._id);

            let payloadAccess = { username: user.username , createdTime: currentTime};
            let payloadRefresh = { username: user.username, id: user._id, createdTime: currentTime };

            let jwtAccessToken = jwt.sign(payloadAccess, config.jwtSecret);
            let jwtRefreshToken = jwt.sign(payloadRefresh, config.jwtSecret);

            // set to user
            user.refresh_token =  jwtRefreshToken;
            user.created_time_token =  currentTime;

            // save
            user.save(function (err, newUser) {

                if (err) {


                    return;
                }

                // data
                let data = {access_token: jwtAccessToken, refresh_token: jwtRefreshToken, token_type: "Bearer"};

                // response
                let _responseJson = responseJson.status.get(true, constant.SUCCESSS ,'Login ok');
                _responseJson.token = data;

                res.json(_responseJson);
            });



        } else {
            // response
            let _responseJson = responseJson.status.get(false, constant.FAILURE ,'Login Error');

            res.json(_responseJson);
        }
    })
};


exports.logout = function(req, res) {
    res.send('NOT IMPLEMENTED: logout');
};

exports.isAuthenticated = function(req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        var jwtToken =  req.headers.authorization.split(' ')[1];
        jwt.verify(jwtToken, config.jwtSecret, function(err, payload) {

            if (err) {
                res.status(401).json({message: 'Unauthorized user!'});
            } else {

                // check time expried
                let now = new Date();
                let currentTime = now.getTime();
                let createdTime = payload.createdTime;
                let differTime = (currentTime - createdTime) / 1000;
                let time_expried = 30 * 6000
                if (differTime > time_expried ) {
                    res.status(401).json({message: 'Unauthorized user!'});
                    return;
                }

                // get user
                let username = payload.username
                // find
                User.findOne({
                    'username': username
                }, function(err, user) {
                    console.log('decoder: ' + username + " " + createdTime + " " + user.created_time_token );
                    if (user &&
                        user.created_time_token === createdTime.toString()) {
                        req.user = user;
                        next();

                    } else {
                        res.status(401).json({ message: 'Unauthorized user!' });
                    }
                })
            }

        });
    } else {
        res.status(401).json({ message: 'Unauthorized user!' });

    }
};

exports.token = function(req, res, next) {

    let grant_type = req.body.grant_type;

    if (grant_type === "refresh_token") {

        let refreshToken = req.body.refresh_token;

        jwt.verify(refreshToken, config.jwtSecret, function(err, payload) {

            if (err) {
                res.status(401).json({message: 'Unauthorized user!'});
            } else {

                let username = payload.username

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

                        let jwtAccessToken = jwt.sign(payloadAccess, config.jwtSecret);
                        let jwtRefreshToken = jwt.sign(payloadRefresh, config.jwtSecret);

                        // set to user
                        user.refresh_token =  jwtRefreshToken;
                        user.created_time_token =  currentTime;

                        // save
                        user.save(function (err, newUser) {

                            if (err) {


                                return;
                            }

                            // data
                            let data = {access_token: jwtAccessToken, refresh_token: jwtRefreshToken, token_type: "Bearer"};

                            // response
                            let _responseJson = responseJson.status.get(true, constant.SUCCESSS ,'RefreshToken ok');
                            _responseJson.token = data;

                            res.json(_responseJson);
                        });


                    } else {
                        res.status(401).json({ message: 'Unauthorized user!' });
                    }
                })
            }

        });
    } else {
        res.status(401).json({ message: 'Unauthorized user!' });
    }

};

