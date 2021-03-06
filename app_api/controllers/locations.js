var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (function(){
    var earthRadius = 6371;
    var getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };
    var getRadsFromDistance = function(distance){
        return parseFloat(distance / earthRadius);
    };
    return {
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };
})();

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        }]
    }, function(err, doc){
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, doc);
        }
    });
};

module.exports.locationsList = function (req, res) {
    Loc.find(null,null, {limit: 10}, function(err, locations) {
        if(err){
            sendJsonResponse(res, 404, err);
            return;
        }
        sendJsonResponse(res, 200, locations);
    });
};

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    if (!lng && lng!==0 || !lat && lat!==0){
        sendJsonResponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: 5000,
        num: 10
    };
    Loc.geoNear(point, geoOptions, function (err, results, stats) {
        var locations = [];
        if(err){
            sendJsonResponse(res, 404, err);
        } else {
            console.log("result count: " + results.length);
            results.forEach(function(doc) {
                locations.push({
                    distance: Math.round((doc.dis / 1000)*100)/100,
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};

module.exports.LocationsReadOne = function (req, res) {
    if(req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function(err, location){
                if(!location){
                    console.log("locationid not found");
                    sendJsonResponse(res, 404, {"message": "locationid not found"});
                    return;
                } else if (err) {
                    console.log("error retrieving location from mongo");
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, { "message": "No locationid in request"});
    }    
};

module.exports.locationsUpdateOne = function (req, res) {
    if( req.params && req.params.locationid) {
        Loc
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec(
            function( err, location) {
                if( !location) {
                    sendJsonResponse( res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if( err) {
                    sendJsonResponse( res, 400, err);
                    return;
                }
                location.name = req.body.name;
                //location.address = req.body.address;
                //location.facilities = req.body.facilities.split(", ");
                //location.coords = [parseFloat( req.body.lng), parseFloat( req.body.lat)];
                //location.openingTimes = [{
                //    days: req.body.days1,
                //    opening: req.body.opening1,
                //    closing: req.body.closing1,
                //    closed: req.body.closed1
                //}];
                location.save( function( err, location) {
                    if( err) {
                        sendJsonResponse( res, 404, err);
                    } else {
                        sendJsonResponse( res, 200, location);
                    }
                });
            }
        );    
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
};

module.exports.locationsDeleteOne = function (req, res) {
    if(req.params && req.params.locationid) {
        Loc
            .findByIdAndRemove(req.params.locationid)
            .exec( function (err, location) {
                if(err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 204, null);
                }
            })
    } else {
        sendJsonResponse(res, 404, {
            "message": "must send locationid in URL"
        })
    }
};
