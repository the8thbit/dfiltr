var config  = require( './../../config.js' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
if( config.MONGO_USER && config.MONGO_PASS ) {
	mongoose.connect( 'mongodb://' + config.MONGO_USER + ':' + config.MONGO_PASS + '@' + config.MONGO_IP + ':' + config.MONGO_PORT );
} else if( config.MONGO_USER ) {
	mongoose.connect( 'mongodb://' + config.MONGO_USER + '@' + config.MONGO_IP + ':' + config.MONGO_PORT );
} else {
	mongoose.connect( 'mongodb://' + config.MONGO_IP + ':' + config.MONGO_PORT );
}

var mongo = mongoose.connection;
mongo.on( 'error', console.error.bind( console, 'mongo error:' ) );

//=============================================================================
//LOAD SCHEMAS
//=============================================================================
User   = require( './user-schema.js' );
Client = require( './client-schema.js' );
