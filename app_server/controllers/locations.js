/* GET home page */
module.exports.locationList = function(req, res){
    res.render('location-list', {
         title: 'Loc8r - find a place to work with wifi',
         pageHeader: {
             title: 'Loc8r',
             strapline: 'Find places to work with wifi near you!'
         },
         locations: [{
             name: 'Starcups',
             address: '125 High Street, Reading, RG6 1PS',
             rating: 3,
             facilities: ['Hot drinks', 'Food', 'Premium wifi'],
             distance: '100m'
         },{
             name: 'Cafe Hero',
             address: '125 High Street, Reading, RG6 1PS',
             rating: 4,
             facilities: ['Hot drinks', 'Food', 'Premium wifi'],
             distance: '200m'
         },{
             name: 'Burger Queen',
             address: '125 High Street, Reading, RG6 1PS',
             rating: 2,
             facilities: ['Food', 'Premium wifi'],
             distance: '250m'
         }
         ]
        });
};

/* GET location info page */
module.exports.locationInfo = function(req, res){
    res.render('location-info', { 
        title: 'Loc8r - Starcups',
        pageHeader: {
             title: 'Starcups'
        },
        sidebar: {
            context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
            callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
        },
        location: {
             name: 'Starcups',
             address: '125 High Street, Reading, RG6 1PS',
             openingHours: [
                 {
                     days: 'Monday - Friday',
                     closed: false,
                     opening: '7:00am',
                     closing: '7:00pm'
                 },
                 {
                     days: 'Saturday',
                     closed: false,
                     opening: '8:00am',
                     closing: '4:00pm'
                 },
                 {
                     days: 'Sunday',
                     closed: true
                 }
             ],
             coords: {
                 lat: 51.455041,
                 lng: -0.9690884
             },
             rating: 3,
             facilities: ['Hot drinks', 'Food', 'Premium wifi'],
             distance: '100m',
             notes: "Starcups ",
             reviews: [
                 {
                     rating: 5,
                     author: 'Simon Holmes',
                     timestamp: '16 July 2013',
                     text: "What a great place! I can't say enough good things about it"
                 },
                 {
                     rating: 3,
                     author: 'Charlie Chaplin',
                     timestamp: '16 June 2013',
                     text: "It was okay. Coffee wasn't great, but the wifi was fast."
                 }
             ]
        }
    });
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
