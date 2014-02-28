//====================================
//VERY SIMPLE USERNAME AND PASSWORD SCHEMA
//====================================

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
