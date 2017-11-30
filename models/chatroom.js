//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var ChatRoomSchema = new mongoose.Schema({
    name: String,
    description: String,
    avatarUrl: String,
    status: { type: String },
    created_date: String,
    updated_date: String,
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, {
    collection: 'chatroom'
});

//Export function to create "TimelineSchema" model class
module.exports = mongoose.model('ChatRoom', ChatRoomSchema );
