//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//Define a schema
var UserSchema = new mongoose.Schema({
    username:{ type: String, unique: true, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true, required: true},
    first_name: String,
    last_name: String,
    avatarUrl: String,
    birth_date: String,
    gender: String,
    created_date: String,
    updated_date: String,
    hash_password: { type: String, required: true},
    refresh_token: { type: String },
    created_time_token: { type: String }
}, {
    collection: 'user'
});

// comparePassword
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password)
}

// comparePassword
UserSchema.methods.createHashPassword = function (password) {
    return bcrypt.hashSync(password, 10);
}

//Export function to create "UserSchema" model class
module.exports = mongoose.model('User', UserSchema );
