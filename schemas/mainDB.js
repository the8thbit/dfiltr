//====================================
//CONNECTS TO MONGODB AND LOADS UP ALL SCHEMAS
//NOTE: HERE IS WHERE WE CAN CREATE NEW USERS AND SAVE TO DATABASE
//====================================

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatappdb');
User = require('./schemas/user-schema.js');

var NewUser = new User({
	username: 'testUser',
	password: 'testPassword'
});

testUser.save();
