//=============================================================================
//VERY SIMPLE USERNAME AND PASSWORD SCHEMA WITH PASSWORD HASH
//=============================================================================
var mongoose = require( 'mongoose' );
var schema = mongoose.Schema;

var msgSchema = new schema( {
	userId:     { type: Number, required: true },
	message:    { type: String, required: true },
	date:       { type: Date,   required: true,  default: Date.now }
});

var convoSchema = new schema( {
	users:      { type: Array,       required: false },
	deltas:     { type: Array,       required: true, default: [0,0,0] },
	blueDeltas: { type: Array,       required: false },
	redDeltas:  { type: Array,       required: false },

	topic:      { type: String,      required: true  },
   messages:   { type: [msgSchema], required: false },
	size:       { type: Number,      required: true, default: 0 },

	date:       { type: Date,        required: true, default: Date.now }
});

//export this model
module.exports = mongoose.model( 'convo', convoSchema )
