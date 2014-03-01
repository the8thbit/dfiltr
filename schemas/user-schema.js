//====================================
//VERY SIMPLE USERNAME AND PASSWORD SCHEMA
//====================================

var mongoose = require('mongoose'),
schema = mongoose.schema;

var userSchema = new schema( {
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }
});

module.exports = mongoose.model( 'user', userSchema );
