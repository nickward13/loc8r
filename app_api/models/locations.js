var mongoose = require('mongoose');
var openingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});
var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {type: Number, required: true, min: 0, max: 5},
    reviewText: {type: String, required: true},
    createdOn: {type: Date, "default": Date.now}
});
var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},  // note default is quoted as it is a reserved word in javascript
    facilities: [String],
    coords: {type: [Number], index: '2dsphere'}, // 2dsphere index enables geo-location calculations; note, correct Number array format is longitude then latitude
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
mongoose.model('Location', locationSchema);
