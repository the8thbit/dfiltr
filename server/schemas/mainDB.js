var config  = require( './../../config.js' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
if( config.MONGO_USER && config.MONGO_PASS ) {
	console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
	console.log( 'mongodb://' + config.MONGO_USER + ':' + config.MONGO_PASS + '@' + config.MONGO_IP + ':' + config.MONGO_PORT );
	console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
	mongoose.connect( 'mongodb://' + config.MONGO_USER + ':' + 'p7Ng_cnyHxAw' + '@' + config.MONGO_IP + ':' + config.MONGO_PORT + '/435db' );
} else if( config.MONGO_USER ) {
	mongoose.connect( 'mongodb://' + config.MONGO_USER + '@' + config.MONGO_IP + ':' + config.MONGO_PORT + '/435db' );
} else {
	mongoose.connect( 'mongodb://' + config.MONGO_IP + ':' + config.MONGO_PORT + '/435db' );
}

var mongo = mongoose.connection;
mongo.on( 'error', console.error.bind( console, 'mongo error:' ) );

//=============================================================================
//LOAD SCHEMA
//=============================================================================
User = require( './user-schema.js' ); 
