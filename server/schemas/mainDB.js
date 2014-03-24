var config        = require( './../../config.js' );
var autoIncrement = require( 'mongoose-auto-increment' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
if( config.MONGO_USER && config.MONGO_PASS ) {
	mongoose.connect( 'mongodb://' + config.MONGO_USER + ':' + config.MONGO_PASS + '@' + config.MONGO_IP + ':' + config.MONGO_PORT + '/' + config.MONGO_DB_NAME );
} else if( config.MONGO_USER ) {
	mongoose.connect( 'mongodb://' + config.MONGO_USER + '@' + config.MONGO_IP + ':' + config.MONGO_PORT + '/' + config.MONGO_DB_NAME );
} else {
	mongoose.connect( 'mongodb://' + config.MONGO_IP + ':' + config.MONGO_PORT + '/' + config.MONGO_DB_NAME );
}

var mongo = mongoose.connection;
mongo.on( 'error', console.error.bind( console, 'mongo error:' ) );

//=============================================================================
//LOAD SCHEMAS
//=============================================================================
Convo  = require( './convo-schema.js'  );
User   = require( './user-schema.js'   );
Client = require( './client-schema.js' );
