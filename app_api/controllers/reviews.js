var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

var updateAverageRating = function(locationid) {
    console.log("Need to implement updateAverageRating");
}

var doAddReview = function (req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            "message": "locationid not found"
        });
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save( function( err, location) {
            var thisReview;
            if ( err) {
                sendJsonResponse( res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length -1];
                sendJsonResponse( res, 201, thisReview);
            }
        });
    }
};

module.exports.reviewsCreate = function (req, res) {
    var locationid = req.params.locationid;
    if(locationid) {
        Loc
            .findById(locationid)
            .select('reviews')
            .exec(
                function(err, location) {
                    if(err){
                        sendJsonResponse(res,400,err);
                    } else {
                        doAddReview(req, res, location);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No found, locationid required"
        });
    }
};

module.exports.reviewsReadOne = function (req, res) {
    if(req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(function(err, location){
                var response, review;
                if(!location){
                    console.log("locationid not found");
                    sendJsonResponse(res, 404, {"message": "locationid not found"});
                    return;
                } else if (err) {
                    console.log("error retrieving location from mongo");
                    sendJsonResponse(res, 404, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0){
                    review = location.reviews.id(req.params.reviewid);
                    if (!review) {
                        console.log("Can't find review (" + req.params.reviewid + ") for location (" + req.params.locationid + ")");
                        sendJsonResponse(res, 404, {"message": "reviewid not found"});
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                _id: req.params.locationid
                            },
                            review: review
                        };
                        sendJsonResponse(res, 200, response);
                    }
                } else {
                    sendJsonResponse(res, 404, {"message": "No reviews found"});
                }
            });
    } else {
        sendJsonResponse(res, 404, { "message": "Not found, both locationid and reviewid required in request"});
    }
};
module.exports.reviewsUpdateone = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
            function(err, location) {
                var thisReview;
                if(!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                } else if (location.reviews && location.reviews.length > 0) {
                    thisReview = location.reviews.id(req.params.reviewid);
                    if(!thisReview) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        thisReview.author = req.body.author;
                        thisReview.rating = req.body.rating;
                        thisReview.reviewText = req.body.reviewText;
                        location.save(function(err, location) {
                            if(err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(req.params.locationid);
                                sendJsonResponse(res, 200, thisReview);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No review to update"
                    });
                }
            }
        )
};

module.exports.reviewsDeleteOne = function (req, res) {
    if(req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .exec(function(err, location){
                if(err){
                    sendJsonResponse(res, 404, err);
                } else if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "couldn't find location"
                    });
                } else {
                    if(location.reviews && location.reviews.length > 0) {
                        thisReview = location.reviews.id(req.params.reviewid);
                        if(!thisReview) {
                            sendJsonResponse(res, 404, {
                                "message": "reviewid not found"
                            });
                        } else {
                            location.reviews.id(req.params.reviewid).remove();
                            location.save(function(err) {
                                if(err){
                                    sendJsonResponse(res, 404, err);
                                } else {
                                    updateAverageRating(req.params.locationid);
                                    sendJsonResponse(res, 204, null);
                                }
                            });
                        }
                    }
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "must pass through locationid and reviewid"
        });
    }
};