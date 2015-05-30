// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Swap   = require('./app/models/swap');

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		username: "jorgehg",
		email: "jorge@gmail.com", 
		password: "password", 
		address: "San Felipe 56",
		city: "Queretaro",
		state: "Queretaro",
		country: "Mexico",
		phone: "4421280270",
		zipcode: "76180",
		grade: 0,
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

apiRoutes.post('/register', function(req, res) {

	// find the user
	User.findOne({ $or:[ {'email':req.body.email}, {'username':req.body.username}]},
	function(err, user) {

		if (err) throw err;

		if (user) {
			if(user.email == req.body.email)
				res.status(400).send({ success: false, message: 'Email already exists' });
			else
				res.status(400).send({ success: false, message: 'Username already exists' });
		} else if (!user) {
			if(!req.body.email || !req.body.username || !req.body.password)
				res.status(400).send({ success: false, message: 'Missing necessary fields' });
			else{
				var newUser = new User();
				
	            newUser.email    = req.body.email;
	            newUser.password = newUser.generateHash(req.body.password);
	            newUser.username = req.body.username;
	            newUser.address = req.body.address;
				newUser.city = req.body.city;
				newUser.state = req.body.state;
				newUser.country = req.body.country;
				newUser.phone = req.body.phone;
				newUser.zipcode = req.body.zipcode
				newUser.grade = req.body.grade
	 
	            newUser.save(function(err) {
	                if (err)
	                    res.status(409).send({ error: err, message: "Error with database"});

	                var token = jwt.sign(newUser, app.get('superSecret'), {
						expiresInMinutes: 43200 // expires in 24 hours
					});

					res.json({
						success: true,
						message: 'Registration succesful, enjoy your token!',
						token: token
					});
	            });
        	}
		}

	});
});

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({ $or:[ {'email':req.body.email}, {'username':req.body.username}]},
	function(err, user) {

		if (err) throw err;

		if (!user) {
			res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (!user.validPassword(req.body.password)) {
				res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
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

apiRoutes.get('/swaps', function(req, res) {
	Swap.find({active: true}, function(err, swaps) {
		res.json(swaps);
	});
});

apiRoutes.get('/swaps/latest', function(req, res) {
	Swap.find({active: true}).limit(20).sort({creation_date:'desc'}).exec(function(err, swaps) {
		if(err)
			res.status(404).send({ success: false, message: 'Authentication failed. Wrong password.' });
		res.json(swaps);
	});
});

apiRoutes.get('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){
		if (err)
	        res.status(404).send({ error: err, message: "Swap not found"});
	    res.json(newSwap);
	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});


apiRoutes.put('/updateProfile', function(req, res) {

	User.findById(req.decoded._id, function (err, newUser) {
		if (err) 
			return res.status(404).send({ 
				success: false, 
				message: 'No user found to update'
			});
	  
		newUser.email    = req.body.email;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.username = req.body.username;
        newUser.address = req.body.address;
		newUser.city = req.body.city;
		newUser.state = req.body.state;
		newUser.country = req.body.country;
		newUser.phone = req.body.phone;
		newUser.zipcode = req.body.zipcode;
		newUser.grade = req.body.grade;

		newUser.save(function (err) {
	    	if (err)
	    		return res.status(400).send({ 
					success: false, 
					message: 'Username or email already exist'
				});
	    	
	    	var token = jwt.sign(newUser, app.get('superSecret'), {
				expiresInMinutes: 43200 // expires in 24 hours
			});

			res.json({
				success: true,
				message: 'Update succesful, enjoy your new token!',
				token: token
			});
	  	});
	});
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/mySwaps', function(req, res) {
	Swap.find({}, function(err, swaps) {
		res.json(swaps);
	});
});

apiRoutes.post('/swap', function(req, res) {
	var newSwap = new Swap();
				
	newSwap.title = req.body.title;
	newSwap.request = req.body.request;
	newSwap.offer = req.body.offer;
	newSwap.description = req.body.description;
	newSwap.country = req.body.country;
	newSwap.active = true;
	newSwap.state = req.body.state;
	newSwap.city = req.body.city;
	newSwap._ownerId = req.decoded._id;
	newSwap.creation_date = new Date();

    newSwap.save(function(err) {
        if (err)
            res.status(409).send({ error: err, message: "Error with database"});

      	User.findById(req.decoded._id, function (err, user) {

      		if (err)
	    		return res.status(404).send({ 
					error: err, 
					message: 'User not found'
				});

	    	user.swaps.push(newSwap._id);

      		user.save(function(err){
      			if (err)
		    		return res.status(409).send({ 
						error: err, 
						message: 'Error with database'
					});

      			res.json({
					success: true,
					message: 'Swap created succesfully'
				});

      		});     		
      	});
    });
});

apiRoutes.put('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){

		if (err)
	        res.status(404).send({ error: err, message: "Swap not found"});
	    else if (newSwap._ownerId != req.decoded._id)
	    	res.status(401).send({ error: err, message: "Not authorized to modify this swap"});
		else{
			newSwap.title = req.body.title;
			newSwap.request = req.body.request;
			newSwap.offer = req.body.offer;
			newSwap.description = req.body.description;
			newSwap.country = req.body.country;
			newSwap.state = req.body.state;
			newSwap.city = req.body.city;
			newSwap.creation_date = new Date();

		    newSwap.save(function(err) { 
		        if (err)
		            res.status(409).send({ error: err, message: "Error with saving in database"});

				res.json({
					success: true,
					message: 'Swap updated succesfully'
				});
		    });
		}
	});
});

apiRoutes.delete('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){

		if (err)
	        res.status(404).send({ error: err, message: "Swap not found"});
	    else if (newSwap._ownerId != req.decoded._id)
	    	res.status(401).send({ error: err, message: "Not authorized to modify this swap"});
		else{
			newSwap.active = false;

		    newSwap.save(function(err) { 
		        if (err)
		            res.status(409).send({ error: err, message: "Error with saving in database"});

				res.json({
					success: true,
					message: 'Swap deleted succesfully'
				});
		    });
		}
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
