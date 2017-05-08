var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/Loc8r';
if (process.env.NODE_ENV === 'production'){
    // note: set MONGOLAB_URI environment variable (or appsetting) for production use
    dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

// Wire up connected, error and disconnected events to output to console
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// Disconnect from Mongoose, normally upon app shutdown
var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close( function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// Listen for SIGUSR2, which is what nodemon uses to restart app
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Listen for SIGINT, which is normal linux app shutdown
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// Listen for SIGTERM, which is Heroku app shutdown
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./locations');