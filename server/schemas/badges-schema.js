//=============================================================================
//BADGES-SCHEMA
//=============================================================================
var mongoose = require( 'mongoose' );
var schema = mongoose.Schema

var badgesSchema = new schema( {
	name:       { type: String, required: true },
	image:      { type: String, required: true },
	difficulty: { type: String, required: true },
	description:{ type: String, required: true },	
	subdocs:    [{ date: { type: Date,   required: true,  default: Date.now },
		       username: { type: String, required: true }, 	     
		       ownerNum: { type: Number, required: true }	      }]},
});

module.exports = mongoose.model( 'badges', badgesSchema );








