var CONSTANT = require('../helpers/constants');
var JsonGenerator = require('../helpers/json-generator');
var ChatRoom = require('../models/chatroom');

// create
exports.create_chatroom = function(req, res) {

     // get user
    var chatroom = new ChatRoom(req.body);
    chatroom.admin_id = req.user._id;

    // save
    chatroom.save(function (err, newChatroom) {

        if (err) {

            // response
            let _responseJson = JsonGenerator.status.updateDbError();
            res.status(409).json(_responseJson);
            return;
        }

        // response
        let _responseJson = JsonGenerator.status.success();
        _responseJson.chatroom = newChatroom.populate('admin_id');

        res.status(201).json(_responseJson);

    });

};

// Get list chatroom
exports.list_chatroom = function(req, res) {

    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || CONSTANT.PAGE_SIGE;
    let skip = page * page_size - page_size;

    // find
    ChatRoom.find().skip(skip).limit(page_size).exec(function(err, chatroom) {

        let last_index = skip + chatroom.length;
        if (chatroom) {
            ChatRoom.count().exec(function(err, count) {
                if (err) {
                    // response
                    let _responseJson = JsonGenerator.status.updateDbError();
                    res.status(409).json(_responseJson);
                    return;
                }

                // response
                let _responseJson = JsonGenerator.status.success();
                let pagination = JsonGenerator.pagination.get(page, page_size, count, Math.ceil(count / page_size), last_index);
                _responseJson.chatrooms = chatroom;
                _responseJson.pagination = pagination;
                res.status(200).json(_responseJson);
            })

        } else {
            // response
            let _responseJson = JsonGenerator.status.failure();
            res.status(200).json(_responseJson);

        }
    })
};