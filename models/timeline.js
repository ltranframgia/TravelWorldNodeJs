//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var TimelineSchema = new mongoose.Schema({
    post_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    created_date: String

}, {
    collection: 'timeline'
});

//Export function to create "TimelineSchema" model class
module.exports = mongoose.model('Timeline', TimelineSchema );
