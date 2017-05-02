/* GET home page */
module.exports.locationList = function(req, res){
    res.render('location-list', { title: 'Home' });
};

/* GET location info page */
module.exports.locationInfo = function(req, res){
    res.render('location-info', { title: 'Location info' });
};

/* GET add review page */
module.exports.addReview = function(req, res){
    res.render('index', { title: 'Add review' });
};
