var mongoose = require( 'mongoose' );
var schema = mongoose.Schema

//create schema model
var clientSchema = new schema( {
	ip:    { type: String, required: true, index: { unique: true } },
	flags: { type: Number, required: true, },
});

//export this model
module.exports = mongoose.model( 'client', clientSchema );




