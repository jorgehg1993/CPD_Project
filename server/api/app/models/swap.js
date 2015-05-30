var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Swap', new Schema({ 
	title: String, 
	request: String, 
	offer: String,
	description: String,
	state: String,
	active: Boolean,
	city: String,
	country: String,
	_ownerId: Schema.Types.ObjectId, 
	creation_date: { type: Date, default: Date.now } 
}));