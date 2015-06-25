var mongoose = require('mongoose');
var Schema = mongoose.Schema;

messageSchema = new mongoose.Schema({ 
	sender: {type: Schema.Types.ObjectId, required: true}, 
	receiver: {type: Schema.Types.ObjectId, required: true}, 
	text_content: String,
	active: Boolean,
	creation_date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Message', messageSchema)