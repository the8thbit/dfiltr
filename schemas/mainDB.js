var config  = require( './../config.js' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
mongoose.connect( config.MONGO_IP + ':' + config.MONGO_PORT + '/chatappdb' );

var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'mongo error:' ) );

//=============================================================================
//LOAD SCHEMA
//=============================================================================
user = require( './user-schema.js' );

var newUser = new user( {
	username: 'testUser1',
	password: 'testPassword1'
});

newUser.save();
