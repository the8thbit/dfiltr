var config  = require( './../config.js' );

//====================================
//CONNECTS TO MONGODB AND LOADS UP ALL SCHEMAS
//NOTE: HERE IS WHERE WE CAN CREATE NEW USERS AND SAVE TO DATABASE
//====================================
var mongoose = require( 'mongoose' );
mongoose.connect( config.MONGO_IP + ':' + config.MONGO_PORT + '/chatappdb' );
user = require( './user-schema.js' );

var newUser = new user( {
	username: 'testUser1',
	password: 'testPassword1'
});

newUser.save();
