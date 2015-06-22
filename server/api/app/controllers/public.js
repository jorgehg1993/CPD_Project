var express = require('express')
var router = express.Router()
var User   = require('../../app/models/user'); // gets mongoose User model
var Swap   = require('../../app/models/swap'); // gets mongoose Swap model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config.js'); // gets config file
var passport = require('passport'); // gets passport plugin reference
var FacebookTokenStrategy = require('passport-facebook-token').Strategy; // creates a new strategy for passporrt

// Function required by passport to serialize a user
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Function required by passport to deserialize a user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Passport function to call when logging in with Facebook
passport.use('facebook-token', new FacebookTokenStrategy({
		clientID: '413104378894077',
		clientSecret: '344f59c9196c3e9388de85c26819a1a0'
	},
	function(accessToken, refreshToken, profile, done){
		User.findOne({ 'facebook.facebookId': profile.id }, function(err, user){
			if (err) return done(err, null);
			if (user) {
				console.log('USUARIO ENCONTRADO: ' + JSON.stringify(user, null, 4));
				
				return done(null, user);
			} else {
				console.log('USUARIO NO ENCONTRADO');
				var newUser = new User();
				
	            newUser.email = profile.emails[0].value;
	            newUser.facebook.facebookId = profile.id;
	            newUser.facebook.fbAccountLinked = true;
	            newUser.first_name = profile.first_name;
	            newUser.last_name = profile.last_name;
				newUser.grade = 0;
	 
	            newUser.save(function(err) {
	                if (err)
	                    return done(err, null);
	                console.log('USUARIO CREADO: ' + JSON.stringify(newUser, null, 4));
	                return done(null, newUser);
	            });
			}
		})
	}
));

// API POST function that receives passport authenticaton and returns a token
router.post('/fb-login', passport.authenticate('facebook-token'), function(req, res){
	console.log('Entrando a llamada de API...');
	if(req.user){
		console.log('creando token...');
		var token = jwt.sign(req.user, config.secret, {
			expiresInMinutes: 43200 // expires in 1 month
		});

		res.json({
			success: true,
			message: 'Log in succesful!',
			token: token
		});
	}else{
		console.log('Login error');
		res.status(401).send({success: false, message: "User couldn't get registered"});
	}
}),

// API POST function used to register a new user using an email and password
router.post('/register', function(req, res) {
	// find the user
	User.findOne({ $or:[{'email':req.body.email}, {'username':req.body.username}]},
	function(err, user) {

		if (err) throw err;

		if (user) {
			if(user.email == req.body.email)
				res.status(400).send({ success: false, message: 'User already exists with that email'});
			else if(user.username == req.body.username)
				res.status(400).send({success: false, message: 'Username already exists, choose another one'});
		} else if (!user) {
			if(!req.body.email || !req.body.password)
				res.status(400).send({ success: false, message: 'Missing necessary fields' });
			else{
				var newUser = new User();
				
	            newUser.email = req.body.email;
	            newUser.local.password = newUser.generateHash(req.body.password);
	            newUser.local.passwordCreated = true;
	            newUser.username = req.body.username;
	            newUser.first_name = req.body.first_name;
	            newUser.last_name = req.body.last_name;
	            newUser.address = req.body.address;
				newUser.city = req.body.city;
				newUser.state = req.body.state;
				newUser.country = req.body.country;
				newUser.phone = req.body.phone;
				newUser.zipcode = req.body.zipcode;
				newUser.grade = 0;
	 
	            newUser.save(function(err) {
	                if (err)
	                    res.status(409).send({ error: err, message: "Error with database"});

	                var token = jwt.sign(newUser, config.secret, {
						expiresInMinutes: 43200 // expires in 1 month
					});

					res.json({
						success: true,
						message: 'Registration succesful!',
						token: token
					});
	            });
        	}
		}

	});
})


// API POST function that receives a login an password in the body request
// to validate a registered user and return a new access token if successfull
router.post('/login', function(req, res) {

	if(!req.body.email || !req.body.password){
		return res.status(400).send({success: false, message: 'Email or password missing'});
	}

	// find the user
	User.findOne({'email':req.body.email},
	function(err, user) {

		if (err) throw err;

		if (!user) {
			res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			if(user.local.password === undefined){
				return res.status(400).send({success: false, message: 'Email associated with fb account. Login with facebook'});
			}
		
			// check if password matches
			if (!user.validPassword(req.body.password)) {
				res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, config.secret, {
					expiresInMinutes: 43200 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}

	});
});

// API GET function that retrieves all swaps stored in database
router.get('/swaps', function(req, res) {
	Swap.find({active: true}, function(err, swaps) {
		res.json(swaps);
	});
})

// API GET function that retrieves the last 10 swaps submitted 
router.get('/swaps/latest', function(req, res) {
	Swap.find({active: true}).sort({creation_date:'desc'}).exec(function(err, swaps) {
		if(err)
			res.status(404).send({ success: false, message: 'Authentication failed. Wrong password.' });
		res.json(swaps);
	});
})

// API GET function that retrieves an specific swap by its id
router.get('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){
		if (err)
	        res.status(404).send({ error: err, message: "Swap not found"});
	    res.json(newSwap);
	});
})

// API GET function that retrieves swaps by a given location
router.get('/swaps/location', function(req, res){
	//var search = req.param('search');
	var lat1 = req.param('lat');
	var lon1 = req.param('lon');

	if(typeof lat1 === 'undefined' || typeof lon1 === 'undefined')
		res.status(400).send({ success: false, message: "No coordinates provided"});

	Swap.find({active: true}).lean().exec(function(err, swaps) {

		if(err)
			res.status(404).send({ success: false, message: JSON.stringify(err)});

		for(var i=0; i < swaps.length; i++){
			if(swaps[i].latitude != null && swaps[i].longitude != null){
				var lat2 = swaps[i].latitude;
				var lon2 = swaps[i].longitude;
				var R = 6371; // km 
				var x1 = lat2-lat1;
				var dLat = x1 * Math.PI / 180;  
				var x2 = lon2-lon1;
				var dLon = x2 * Math.PI / 180;  
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
				                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI /180) * 
				                Math.sin(dLon/2) * Math.sin(dLon/2);  
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = R * c; 
				swaps[i].distance = d;
			}else{
				swaps[i].distance = 0.0;
			}
		}

		res.json(swaps);
	});

})

// API GET function that retrieves all 
router.get('/swaps/search/location', function(req, res){
	var lat1 = req.param('lat');
	var lon1 = req.param('lon');
	var searchQuery = req.param('sQuery')

	if(typeof lat1 === 'undefined' || typeof lon1 === 'undefined')
		return res.status(400).send({ success: false, message: "No coordinates provided"});
	else if (typeof searchQuery === 'undefined')
		return res.status(400).send({ success: false, message: "No search query provided"});

	var options ={
		lean :true
	}

	searchQuery = searchQuery.split('+').join(' ')

	Swap.textSearch(searchQuery, options, function(err, swaps) {
		if(err)
			return res.status(404).send({ success: false, message: JSON.stringify(err)});

		if(swaps == null)
			return res.status(404).send({ success: false, message: "No elements found with search"});

		for(var i=0; i < swaps.results.length; i++){
			if(swaps.results[i].obj.latitude != null && swaps.results[i].obj.longitude != null){
				var lat2 = swaps.results[i].obj.latitude;
				var lon2 = swaps.results[i].obj.longitude;
				var R = 6371; // km 
				var x1 = lat2-lat1;
				var dLat = x1 * Math.PI / 180;  
				var x2 = lon2-lon1;
				var dLon = x2 * Math.PI / 180;  
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
				                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI /180) * 
				                Math.sin(dLon/2) * Math.sin(dLon/2);  
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = R * c; 
				swaps.results[i].obj.distance = d;
			}
		}

		res.json(swaps);
	});
})

router.get('/swaps/search/', function(req, res){
	var searchQuery = req.param('sQuery')

	if (typeof searchQuery === 'undefined')
		return res.status(400).send({ success: false, message: "No search query provided"});

	var options = {
		lean :true
	}

	searchQuery = searchQuery.split('+').join(' ')

	Swap.textSearch(searchQuery, options, function(err, swaps) {

		if(err)
			res.status(404).send({ success: false, message: JSON.stringify(err)});

		res.json(swaps);
	});
})

module.exports = router

