//=============================================================================
//VERY SIMPLE USERNAME AND PASSWORD SCHEMA WITH PASSWORD HASH
//=============================================================================
var mongoose = require( 'mongoose' );
var schema = mongoose.Schema;

var msgSchema = new schema( {
	userId:  { type: Number, required: true },
	message: { type: String, required: true },
	date:    { type: Date, required: true, default: Date.now }
});

var convoSchema = new schema( {
	userOne:   { type: String, required: false },
	userTwo:   { type: String, required: false },

	deltasOne:   { type: Number, required: true, default: 0 },
	deltasTwo:   { type: Number, required: true, default: 0 },
	deltasTotal: { type: Number, required: true, default: 0 },

	topic:     { type: String, required: true },
   messages:  { type: [msgSchema], required: false },

	date:      { type: Date, required: true, default: Date.now }
});

//export this model
module.exports = mongoose.model( 'convo', convoSchema )
