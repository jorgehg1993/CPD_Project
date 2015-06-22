var express = require('express')
var router = express.Router()
var User   = require('../../app/models/user'); // gets mongoose User model
var Swap   = require('../../app/models/swap'); // gets mongoose Swap model
var Message = require('../../app/models/message.js');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config.js'); // get our config file

// route middleware to authenticate and check token
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.status(400).send({ success: false, message: 'Failed to authenticate token.' });		
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

// API GET function that gets a logged in user's information
router.get('/profile', function(req, res){
	User.findById(req.decoded._id, function(err, user){
		if(err)
			return res.status(400).send({ 
				success: false, 
				message: err
			});
		if(!user){
			return res.status(404).send({ 
				success: false, 
				message: 'User not found'
			});
		}
		return res.send(user);
	})
});

// API PUT function that updates a logged in user's information
router.put('/profile', function(req, res) {

	console.log(req.body);

	User.findById(req.decoded._id, function (err, newUser) {
		if (err) 
			return res.status(404).send({ 
				success: false, 
				message: 'No user found to update'
			});

	  	if(newUser == null)
	  		return res.status(404).send({ success: false, message: 'No user found for update'});

        newUser.username = req.body.username;
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.address = req.body.address;
		newUser.city = req.body.city;
		newUser.state = req.body.state;
		newUser.country = req.body.country;
		newUser.phone = req.body.phone;
		newUser.zipcode = req.body.zipcode;

		newUser.save(function (err) {
	    	if (err)
	    		return res.status(400).send({ 
					success: false, 
					message: 'Username already exist. ' + JSON.stringify(err)
				});
	    	
	    	var token = jwt.sign(newUser, config.secret, {
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


router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

// API GET function that retrieves all users stored in database
router.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

router.get('/receiver/:id', function(req, res){
	User.findById(req.params.id, 'username first_name last_name', function(err, user){
		if (err)
			return res.send(err);
		if(user == null)
			return res.status(404).send({success: false, message: "No user found"});

		res.json(user);
	})
});

// API GET function that retrieves all swaps belonging to an authenticated user
router.get('/mySwaps', function(req, res) {
	Swap.find({$and: [{_ownerId: req.decoded._id}, {active: true}]}, function(err, swaps) {
		if(err)
			return res.send(err);
		res.json(swaps);
	});
});

// API GET function that retrieves an specific swap belonging to an athenticated user
router.get('/mySwaps/:id', function(req, res) {
	Swap.findOne({$and: [{_ownerId: req.decoded._id}, {_id: req.params.id}]}, function(err, swaps) {
		if(err)
			return res.send(err);
		res.json(swaps);
	});
});

// API POST function that creates a new swap for an authenticated user
router.post('/swap', function(req, res) {
	var newSwap = new Swap();
				
	newSwap.title = req.body.title;
	newSwap.request = req.body.request;
	newSwap.offer = req.body.offer;
	newSwap.description = req.body.description;
	newSwap.country = req.body.country;
	if(req.body.country !== 'Worldwide'){
		newSwap.state = req.body.state;
		newSwap.city = req.body.city;
		newSwap.latitude = req.body.latitude;
		newSwap.longitude = req.body.longitude;
	}
	newSwap.active = true;
	newSwap._ownerId = req.decoded._id;
	newSwap.creation_date = req.body.creation_date || new Date();

    newSwap.save(function(err) {
        if (err)
            return res.status(409).send({ error: err, message: "Error with database"});

      	User.findById(req.decoded._id, function (err, user) {

      		if (err)
	    		return res.status(404).send({ 
					error: err, 
					message: 'User not found'
				});

	    	if(user == null)
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

		    	console.log('New swap created at: ' + newSwap.creation_date);
      			res.json({
					success: true,
					message: 'Swap created succesfully'
				});

      		});     		
      	});
    });
});

// API PUT function that updates an specific swap from an authenticated user
router.put('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){

		if (err)
	        return res.status(404).send({ error: err, message: "Swap not found"});
	    else if(newSwap == null)
	    	return res.status(404).send({ error: err, message: "Swap not found"});
	    else if (newSwap._ownerId != req.decoded._id)
	    	return res.status(401).send({ error: err, message: "Not authorized to modify this swap"});
		else{
			newSwap.title = req.body.title;
			newSwap.request = req.body.request;
			newSwap.offer = req.body.offer;
			newSwap.description = req.body.description;
			newSwap.country = req.body.country;
			if(req.body.country !== 'Worldwide'){
				newSwap.state = req.body.state;
				newSwap.city = req.body.city;
				newSwap.latitude = req.body.latitude;
				newSwap.longitude = req.body.longitude;
			}else{
				newSwap.state = null;
				newSwap.city = null;
				newSwap.latitude = null;
				newSwap.longitude = null;
			}
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


// API DELETE function that deletes an specific swap 
router.delete('/swap/:id', function(req, res) {
	Swap.findById(req.params.id, function(err, newSwap){

		if (err)
	    	return res.status(404).send({ error: err, message: "Swap not found"});
	    else if (newSwap._ownerId != req.decoded._id)
	    	return res.status(401).send({ error: err, message: "Not authorized to modify this swap"});
	    else if (newSwap == null)
	    	return res.status(404).send({ error: err, message: "Swap not found"});
		else{
			newSwap.active = false;

		    newSwap.save(function(err) { 
		        if (err)
		            return res.status(409).send({ error: err, message: "Error with saving in database"});

				res.json({
					success: true,
					message: 'Swap deleted succesfully'
				});
		    });
		}
	});
});

router.post('/message', function(req, res){
	var newMessage = new Message()

	if(!req.body.receiverId)
		return res.status(400).send({success: false, message: "No receiver provided"})

	newMessage.sender = req.decoded._id;
	newMessage.receiver = req.body.receiverId;
	newMessage.text_content = req.body.text_content;
	newMessage.active = true;
	newMessage.creation_date = req.body.creation_date || new Date();

    newMessage.save(function(err) {
        if (err)
            return res.status(409).send({ error: err, message: "Error with database"});

      	User.findById(req.decoded._id, function (err, user) {

      		if (err)
	    		return res.status(404).send({ 
					error: err, 
					message: 'User not found'
				});

	    	if(user == null)
	    		return res.status(404).send({ 
					error: err, 
					message: 'User not found'
				});

	    	user.contacted.push(req.body._id);

      		user.save(function(err){
      			if (err)
		    		return res.status(409).send({ 
						error: err, 
						message: 'Error with database'
					});

      			res.json({
					success: true,
					message: 'Message sent succesfully'
				});

      		});     		
      	});
    });
});

router.get('/check', function(req, res) {
	res.json(req.decoded);
});

module.exports = router