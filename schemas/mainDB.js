//====================================
//CONNECTS TO MONGODB AND LOADS UP ALL SCHEMAS
//NOTE: HERE IS WHERE WE CAN CREATE NEW USERS AND SAVE TO DATABASE
//====================================
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.SERVER_IP + ':' 27017 + '/chatappdb');
User = require('./user-schema.js');

var NewUser = new User({
	username: 'testUser1',
	password: 'testPassword1'
});

NewUser.save();
