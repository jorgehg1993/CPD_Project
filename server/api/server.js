// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var cors 		= require('cors');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport = require('passport');

var config = require('./config'); // get our config file

// Server configuration 
var port = process.env.PORT || 3001; // define port
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
app.use(cors()); // allow cors feature for the server

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(passport.initialize());

// load routes for api
app.use(require('./app/controllers'));

// start the server 
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
