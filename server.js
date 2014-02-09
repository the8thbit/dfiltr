//====================================
//SERVER CONFIGURATION
//====================================
//IP ADDRESS 
  var IP_ADD =
//'localhost'; //toggle on for local testing
  process.env.OPENSHIFT_NODEJS_IP; //toggle on for openshift deploy
//======================================
//PORT NUMBER
  var PORT_NUM = 
//8080; //toggle on for local testing
//80;
  process.env.OPENSHIFT_NODEJS_PORT; //toggle on for openshift deploy
//====================================

//====================================
//SERVER START UP
//====================================
//use express
var express = require( 'express' );
var app = express();
app.use( express.static( __dirname + '/' ) );

//use jade templates for HTML and CSS
app.set( 'views', __dirname + '/tpl' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require( 'jade' ).__express );
app.get( '/', function( req, res ){ res.render( 'page' ); } );

//use socket.io and give it a location to listen on 
var io = require( 'socket.io' ).listen( app.listen(PORT_NUM, IP_ADD) );

//turn websockets on
io.configure( function() {
	io.set( 'transports', [ 'websocket' ] );
} );

console.log( 'listening at ' + IP_ADD + ' on port ' + PORT_NUM ); 

//====================================
//CHAT PROTOCOL
//====================================
var sockets = []; //list of all users
var pool = [];    //pool of unpaired users

//what to do when the socket connects (this also bootstraps the rest of the protocol)
io.sockets.on( 'connection', function( socket ) {
	socket.emit( 'message', { message: 'Welcome to the chat.' } );
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
		socket.partner.emit( 'message', { message: 'You\'ve been paired with a user.' } );
		partner.partner.emit( 'message', { message: 'You\'ve been paired with a user.' } );
		socket.emit( 'event', { type: 'paired to user' } );
		partner.emit( 'event', { type: 'paired to user' } );
	} else {
		console.log( '| partner could not be found in pool' );
		socket.pool = pool.push( socket );
		console.log( '| added user to pool at position ' + socket.pool );
		socket.emit( 'message', { message: 'Looking for a partner...' } );
	}

	console.log( 'user connected' );

	//what to do when the user disconnects
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
			socket.partner.emit( 'event', { type: 'partner disconnected' } );
			socket.partner.emit( 'message', { message: 'Your conversational partner has disconnected.' } );
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
	} );

	//when server recieves 'send' relay 'message' to client
	//'send' is a chat message coming from a client, and
	//'message' is a chat message being sent from the server to a client.
	socket.on( 'send', function( data ) {
		if( socket.partner ) {
			socket.partner.emit( 'message', data );
		} else {
			socket.emit( 'message', { message: 'We are having technical difficulties. You don\'t have a partner, but you think you do. Basically, you\'re far more alone than you believe. Let\'s get you someone new to talk to.' } );
			if( !socket.pool ) { socket.pool = pool.push( socket ); }  
			socket.emit( 'message', { message: 'Looking for a partner...' } );
		}
	} );
} );
