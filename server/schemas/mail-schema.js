var mongoose = require( 'mongoose' );
var schema = mongoose.Schema;

var msgSchema = new schema( {
	userId:    { type: Number, required: true },
	message:   { type: String, required: true },
	date:      { type: Date,   required: true,  default: Date.now }
});

var mailSchema = new schema( {
	to:        { type: String, required: true },
	from:      { type: String, required: true },
   messages:  { type: [msgSchema], required: false },
	new:       { type: Number, required: true, default: 0 },
	date:      { type: Date, required: true, default: Date.now }
});

//export this model
module.exports = mongoose.model( 'mail', mailSchema )
