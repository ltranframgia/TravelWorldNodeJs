var Timeline = require('../models/timeline');
var responseJson = require('../models/responseJson');
var constant = require('../helpers/constants');

// Register
exports.create_timeline = function(req, res) {

    // get user
    var timeline = new Timeline(req.body);
    timeline.post_user_id = req.user._id;

    // save
    timeline.save(function (err, newTimeline) {

        // response
        var _responseJson = responseJson.ResponseJson;
        _responseJson.clear();
        if (err) {

            // _responseJson.status(true, constant.DUPLICATE_USERNAME_OR_MAIL, 'Account already exists.')
            res.status(409).json(_responseJson.render());
            return
        }

        _responseJson.status(false, constant.SUCCESSS,'ok');
        _responseJson.data([newTimeline.populate('post_user')]);
        res.status(201).json(_responseJson.render());

    });

};

// Get list timeline
exports.list_timeline = function(req, res) {

    // find
    Timeline.find({}, function(err, timeline) {

        var _responseJson = responseJson.ResponseJson;
        _responseJson.clear();
        if (timeline) {
            _responseJson.status(false, 'SUCCESSS','get list timeline');
            _responseJson.data(timeline);
            res.status(200).json(_responseJson.render());
        } else {
            _responseJson.status(true,'FAIL','get timeline error');
            res.status(200).json(_responseJson.render());
        }
    })
};