var mongoose = require('mongoose');
var Config = require('../helpers/config');

exports.connectMongoDb = function() {
    //connect to MongoDB
    var mongodbUri = Config.dbUri
    var options = {
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    };

    mongoose.connect(mongodbUri, options);
};