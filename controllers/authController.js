var User = require('../models/user');
var config = require('../helpers/config');
var constant = require('../helpers/constants');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var responseJson = require('../models/responseJson');

// login
exports.login = function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    console.log('New user: ' + username + ' ' + password);
    // find
    User.findOne({
        'username': username
    }, function(err, user) {

        if (!user) {
            var _responseJson = responseJson.ResponseJson
            _responseJson.clear()
            _responseJson.status(true, constant.FAILURE,'User is not exist')

            res.json(_responseJson.render());

        } else if (user &&
            user.comparePassword(password)) {

            var payload = { username: user.username };
            var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: 60 * 60 });

            var data = {access_token: jwtToken, refresh_token: "xxxxx-xxx-xx-x"}

            var _responseJson = responseJson.ResponseJson
            _responseJson.clear()
            _responseJson.status(false, constant.SUCCESSS ,'Login ok')
            _responseJson.data(data)
            res.json(_responseJson.render());


        } else {
            var _responseJson = responseJson.ResponseJson
            _responseJson.clear()
            _responseJson.status(true, constant.FAILURE, 'Login Error')
            res.json(_responseJson.render());
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
                console.log('decoder: ' + payload.username);
                // find
                User.findOne({
                    'username': payload.username
                }, function(err, user) {

                    if (user) {
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

exports.refreshToken = function(req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {


        var payload = { username: user.username };
        var jwtToken = jwt.sign(payload, config.jwtSecret);
        console.log('jwtToken: ' + jwtToken);
        var jsonResponse = {'access_token': jwtToken, 'refresh_token': "xxxxx-xxx-xx-x"}
        res.json(jsonResponse)

    } else {
        res.status(401).json({ message: 'Unauthorized user!' });

    }
};

