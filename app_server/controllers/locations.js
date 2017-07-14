var request = require('request');

var apiOptions = {
    server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://loc8r-hect.azurewebsites.net"
}

var _showError = function(req, res, status){
  var title, content;
  if(status === 404){
      title = "404, page not found";
      content = "Oh dear.  Looks like we can't find this page. Sorry.";
  } else {
      title = status + ", something's gone wrong";
      content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
      title: title,
      content: content
  });
};

var renderHomepage = function(req, res, responseBody) {
    var message;
    if(!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }
    res.render('location-list', {
         title: 'Loc8r - find a place to work with wifi',
         pageHeader: {
             title: 'Loc8r',
             strapline: 'Find places to work with wifi near you!'
         },
         locations: responseBody,
         message: message
        });
};

var renderDetailPage = function(req, res, locationDetail) {
    console.log(locationDetail._id);
    res.render('location-info', { 
        title: locationDetail.name,
        pageHeader: {
             title: locationDetail.name
        },
        sidebar: {
            context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
            callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
        },
        location: locationDetail
    });
}

/* GET home page */
module.exports.locationList = function(req, res){
    var requestOptions, path;
    var lat, long;
    lat = -37.8730680;
    long = 145.0419910;
    path = '/api/locations/nearby?lng=' + long + '&lat='+lat;
    console.log('path request: ' + path);
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {}
    };
    request(
        requestOptions, function(err, response, body) {
            renderHomepage(req, res, body);
        }
    );
};

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions, function(err, response, body) {
            var data = body;
            if(response.statusCode === 200){
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

/* GET location info page */
module.exports.locationInfo = function(req, res){
    getLocationInfo(req, res, renderDetailPage);
};

var renderReviewForm = function (req, res, locationDetail) {
    res.render('location-review-form', {
        title: 'Review ' + locationDetail.name + ' on Loc8r',
        pageHeader: {
            title: 'Review ' + locationDetail.name
        },
        error: req.query.err
    });
};

module.exports.addReview = function(req, res){
    getLocationInfo(req, res, renderReviewForm);
};

module.exports.doAddReview = function(req, res){
    var path = '/api/locations/' + req.params.locationid + '/reviews';
    var postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    }
    var requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    if (!postData.author || !postData.rating || !postData.reviewText) {
        res.redirect('/location/' + req.params.locationid + '/reviews/new?err=val');
    } else {
        request(
            requestOptions, function(err, response, body) {
                if(response.statusCode === 201){
                    res.redirect('/location/' + req.params.locationid);
                } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                    res.redirect('/location/' + req.params.locationid + '/reviews/new?err=val');
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};
