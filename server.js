//====================================
//SERVER START UP
//====================================
var config = require( './config.js' );

var express = require( 'express' );
stylus = require( 'stylus' );

var app = express();

function compile( str, path ) { 
	return stylus( str ).set( 'filename', path ); 
} 

app.use( stylus.middleware( { src: __dirname + '/' , compile: compile } ) )
app.use( express.static( __dirname + '/' ) );

//use jade templates for HTML
app.set( 'views', __dirname + '/client' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require( 'jade' ).__express );

app.get( '/', function( req, res ){ res.render( 'chat/chat' ); } );
app.get( '/modules/ratings', function( req, res ){ res.render( 'modules/ratings/ratings' ); } );
app.get( '/modules/dock', function( req, res ){ res.render( 'modules/dock/dock' ); } );

//use socket.io and give it a location to listen on 
var io = require( 'socket.io' ).listen( app.listen( config.SERVER_PORT, config.SERVER_IP ) );

//turn websockets on
io.configure( function() {
	io.set( 'transports', [ 'websocket' ] );
} );

console.log( 'listening at ' + config.SERVER_IP + ' on port ' + config.SERVER_PORT ); 

//====================================
//CHAT PROTOCOL
//====================================
var sockets = []; //list of all users
var pool = [];    //pool of unpaired users

//what to do when the socket connects (this also bootstraps the rest of the protocol)
io.sockets.on( 'connection', function( socket ) {
	console.log( 'user connecting...' );
	socket.pos = sockets.push( socket ); //add socket to the server's list of sockets
	console.log( '| user added to list of users at position ' + sockets.length );

	//if there are users in the pool, take one of them and make them your
	//partner. If not, jump in the pool.
	if( pool.length ) {
		console.log( '| partner found in pool' );
		var partner = pool.shift();
		partner.pool = null;
		console.log( '| partner removed from pool. Current pool size is: ' + pool.length );
		socket.partner = partner; //adds a '.partner' var to the socket which can be used to
		partner.partner = socket; //access the user's conversational partner
		socket.partner.emit( 'message', { message: 'You\'ve been paired with a user.', type: 'server' } );
		partner.partner.emit( 'message', { message: 'You\'ve been paired with a user.', type: 'server' } );
		socket.emit( 'partner connected' );
		partner.emit( 'partner connected' );
	} else {
		console.log( '| partner could not be found in pool' );
		socket.pool = pool.push( socket );
		console.log( '| added user to pool at position ' + socket.pool );
		socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );
	}

	console.log( 'user connected' );


	//what to do when the user disconnects (through leaving the page: full disconnect)
	socket.on( 'disconnect', function() {		
		console.log( 'user disconnecting...' );

		if( socket.pool ) {
			console.log( '| user is in pool at position ' + socket.pool );
			console.log( '| current size of pool is ' + pool.length );
			console.log( '| removing user from pool...' );	
			pool.splice( socket.pool - 1, 1 );
			socket.pool = null;
			console.log( '| current size of pool is ' + pool.length );
		}

		if( socket.partner ) {
			console.log( '| user has a conversational partner' );
			console.log( '| disconnecting user from partner...' );
			socket.partner.emit( 'partner disconnected' );
			socket.partner.emit( 'message', { message: 'Your conversational partner has disconnected.', type: 'server' } );
			socket.partner.partner = null;
			socket.partner = null;
		}

		if( socket.pos ) {
			console.log( '| user is socket number ' + socket.pos );
			console.log( '| current number of sockets is ' + sockets.length );
			console.log( '| removing user from list of sockets...' );	
			sockets.splice( socket.pos - 1, 1);
			socket.pos = null;
			console.log( '| current number of sockets is ' + sockets.length );
		}

		console.log( 'user disconnected' );
	});

	//what to do when the user disconnects (through hitting the disconnect button: virtual disconnect)
	socket.on( 'virtual disconnect', function() {		
		console.log( 'user disconnecting... (virtual)' );

		if( socket.pool ) {
			console.log( '| user is in pool at position ' + socket.pool );
			console.log( '| current size of pool is ' + pool.length );
			console.log( '| removing user from pool...' );	
			pool.splice( socket.pool - 1, 1 );
			socket.pool = null;
			console.log( '| current size of pool is ' + pool.length );
		}

		if( socket.partner ) {
			console.log( '| user has a conversational partner' );
			console.log( '| disconnecting user from partner...' );
			socket.partner.emit( 'partner disconnected' );
			socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } );
			socket.partner.partner = null;
			socket.partner = null;
		}

		console.log( 'user disconnected (virtual)' );
	});

	socket.on( 'virtual connection', function() {
		console.log( 'user connecting... (virtual)' );

		//if there are users in the pool, take one of them and make them your
		//partner. If not, jump in the pool.
		if( pool.length ) {
			console.log( '| partner found in pool' );
			var partner = pool.shift();
			partner.pool = null;
			console.log( '| partner removed from pool. Current pool size is: ' + pool.length );
			socket.partner = partner; //adds a '.partner' var to the socket which can be used to
			partner.partner = socket; //access the user's conversational partner
			socket.partner.emit( 'message', { message: 'You\'ve been paired with a user.', type: 'server' } );
			partner.partner.emit( 'message', { message: 'You\'ve been paired with a user.', type: 'server' } );
			socket.emit( 'partner connected' );
			partner.emit( 'partner connected' );
		} else {
			console.log( '| partner could not be found in pool' );
			socket.pool = pool.push( socket );
			console.log( '| added user to pool at position ' + socket.pool );
			socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );
		}

		console.log( 'user connected' );
	});


	//when server recieves 'send' relay 'message' to client
	//'send' is a chat message coming from a client, and
	//'message' is a chat message being sent from the server to a client.
	socket.on( 'send', function( data ) {
		data.type = 'partner';
		if( socket.partner ) {
			socket.partner.emit( 'message', data  );
		} else {
			socket.emit( 'message', { message: 'We are having technical difficulties. You don\'t have a partner, but you think you do. Basically, you\'re far more alone than you believe. Let\'s get you someone new to talk to.', type: 'server'} );
			if( !socket.pool ) { socket.pool = pool.push( socket ); }  
			socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );
		}
	});
});
