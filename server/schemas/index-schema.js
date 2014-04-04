//General purpose schema for indexes which don't fit into other shemas

var mongoose = require( 'mongoose' );
var schema = mongoose.Schema

//create schema model
var indexSchema = new schema( {
	name:  { type: String, required: true, unique: true },
	value: { type: Number, required: true, default: 0 },
	note:  { type: String, required: false }
});

//export this model
module.exports = mongoose.model( 'index', indexSchema );
