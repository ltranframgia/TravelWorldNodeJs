

// get current user
exports.users = function(req, res) {
    res.render('index', { title: 'Express user' });
};
