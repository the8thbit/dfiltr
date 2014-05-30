var express    = require( 'express' );
var app        = express();

app.express      = express;
app.config       = require( './config.js' );
app.stylus       = require( 'stylus' );
app.db           = require( './server/schemas/mainDB.js' );
app.speakeasy    = require( 'speakeasy-nlp' );
app.auth         = require( './server/auth.js' )( app );

//standard function for handling errors
//just prints the error to the console
//and executes a callback if one is provided
app.handleErr = function( err, cb ){
	if( err ){
		console.log( err );
	}
	if( cb ){
		cb;
	}
}

if( app.config.PIO_API_IP != 'null' ){
	app.pioMode = true;
}

app.pio = require( 'predictionio' )( {
	key: app.config.PIO_API_KEY,
	baseUrl: app.config.PIO_API_HOST
});
app.pio.ITEMS_PER_USER = 5;

new Index( { name: 'pio_users' } ).save( function(){
	new Index( { name: 'pio_items' } ).save( function(){
		Index.findOne( { name: 'pio_users' }, function( err, index ){
			app.pio.users.index = index;
			app.handleErr( err );
		});
		Index.findOne( { name: 'pio_items' }, function( err, index ){
			app.pio.items.index = index;
			app.handleErr( err );
		});
	});
});

//use stylus templates for CSS
var compile = function( str, path ){ return app.stylus( str ).set( 'filename', path ); } 
app.use( app.stylus.middleware( { src: __dirname + '/' , compile: compile } ) );
app.use( express.static( __dirname + '/' ) );

app.routes          = {};
app.routes.auth     = require( './server/routes/auth.js'    )( app );
app.routes.views    = require( './server/routes/views.js'   )( app );
app.routes.queries  = require( './server/routes/queries.js' )( app );
app.routes.other    = require( './server/routes/other.js'   )( app );

//use socket.io and give it a location to listen on 
app.protocol = require( 'socket.io' ).listen( app.listen( app.config.SERVER_PORT, app.config.SERVER_IP ) );
//app.protocol.set( 'log level', 1 );
//app.protocol.set( 'browser client minification', true );
//app.protocol.set( 'browser client etag', true );

//use passport.socket.io to link passport sessions with a socket
app.protocol.set( 'authorization', app.auth.passportSIO.authorize( {
	cookieParser: express.cookieParser,
	key:          '435.sid',
	secret:       app.config.COOKIE_SECRET,
	store:        app.auth.sessionStore.mongo,
	fail:         function( data, message, error, accept ){ accept( null, true ); }
}));

app.protocol.chat  = require( './server/protocol/chat.js' )( app );
app.protocol.mail  = require( './server/protocol/mail.js' )( app );

console.log( 'All systems are GO!' );
console.log( 'listening at ' + app.config.SERVER_IP + ' on port ' + app.config.SERVER_PORT );


