var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var textSearch = require('mongoose-text-search');

swapSchema = new mongoose.Schema({ 
	title: String, 
	request: String, 
	offer: String,
	description: String,
	state: String,
	active: Boolean,
	city: String,
	country: String,
	latitude: Number,
	longitude: Number,
	_ownerId: Schema.Types.ObjectId, 
	creation_date: { type: Date, default: Date.now } 
});

swapSchema.plugin(textSearch)

swapSchema.index({request: "text", offer: "text", title: "text"});

 module.exports = mongoose.model('Swap', swapSchema)