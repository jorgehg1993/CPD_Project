var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// set up a mongoose model
var userSchema =  mongoose.Schema({ 
	local: {
		password: String,
		passwordCreated: Boolean
	},
	facebook: {
		facebookId: {type: String, sparse: true},
		fbAccountLinked: Boolean
	},
	username: { type: String, sparse: true },
	email: { type: String, unique: true, required: true }, 
	first_name: String,
	last_name: String,
	address: String,
	city: String,
	state: String,
	country: String,
	phone: String,
	zipcode: String,
	grade: Number,
	swaps: [Schema.Types.ObjectId],
	contacted: [Schema.Types.ObjectId]
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);