var config  = require( './../../config.js' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
mongoose.connect( config.MONGO_IP + ':' + config.MONGO_PORT + '/mongo/' );

var mongo = mongoose.connection;
mongo.on( 'error', console.error.bind( console, 'ERROR[mongo]:' ) );

//=============================================================================
//LOAD SCHEMA
//=============================================================================
User = require( './user-schema.js' );

var newUser = new User( {
	username: 'testUser1',
	password: 'testPassword1'
});

newUser.save();
