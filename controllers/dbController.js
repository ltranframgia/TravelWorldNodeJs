var mongoose = require('mongoose');
var config = require('../helpers/config');

exports.connectMongoDb = function() {
    //connect to MongoDB
    var mongodbUri = config.dbUri
    var options = {
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    };

    mongoose.connect(mongodbUri, options);
};