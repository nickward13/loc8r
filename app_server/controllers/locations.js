var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://loc8r-hect.azurewebsites.net"
}

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
    path = '/api/locations';
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

/* GET location info page */
module.exports.locationInfo = function(req, res){
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
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            renderDetailPage(req, res, data);
        }
    );
};

/* GET add review page */
module.exports.addReview = function(req, res){
    res.render('location-review-form', { 
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};
