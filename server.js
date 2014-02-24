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
var pool = [];    //pool of unpaired users

virtualConnect = function( socket ) {
	socket.emit( 'message', { message: 'your ID:' + socket.id, type: 'debug' } );
	socket.inPool = pool.push( socket );
	console.log( 'POOL SIZE: ' + pool.length );
	console.log( 'POOL SIZE: ' + pool.length );
	console.log( 'POOL SIZE: ' + pool.length );
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );

	socket.retry = setInterval( function() {
		socket.emit( 'message', { message: '...', type: 'debug' } );
		if( !socket.partner && socket.inPool && pool[0] && pool[0] != socket ) {
			socket.partner = pool.shift();
			clearInterval( socket.partner.retry );
			clearInterval( socket.retry );

			for( var j=0; j < pool.length; j++ ) {
				if( pool[j].id == socket.id ) {
					pool.splice( j-1, 1 );
					socket.inPool = null;
				} else if( pool[j].id == socket.partner.id ) {
					pool.splice( j-1, 1 );
					socket.partner.inPool = null;
				}
			}
			
			socket.partner.partner = socket;

			socket.partner.emit( 'message', { message: 'You\'ve been paired with a partner.', type: 'server' } );
			socket.partner.emit( 'message', { message: 'partner\'s score: ' + socket.score,   type: 'debug' } );
			socket.partner.emit( 'message', { message: 'partner\'s ID: ' + socket.id,         type: 'debug' } );
			socket.partner.emit( 'message', { message: 'You were picked from the pool.',      type: 'debug' } );

			socket.emit( 'message', { message: 'You\'ve been paired with a partner.',       type: 'server' } );
			socket.emit( 'message', { message: 'partner\'s score: ' + socket.partner.score, type: 'debug' } );
			socket.emit( 'message', { message: 'partner\'s ID: ' + socket.partner.id,       type: 'debug' } );
			socket.emit( 'message', { message: 'You were the picker.',                      type: 'debug' } );
				
			socket.emit( 'partner connected' );
			socket.partner.emit( 'partner connected' );
		} else if( !socket.inPool ) { 
			clearInterval( socket.retry );
		}	
	}, 1000 );
}

virtualDisconnect = function( socket ) {		
	clearInterval( socket.retry );
	for( var j=0; j < pool.length; j++ ) {
		if( pool[j].id == socket.id ) {
			pool.splice( j - 1, 1 );
			socket.inPool = null;
		}
	}
	
	if( socket.partner ) {
		clearInterval( socket.partner.retry );

		for( var j=0; j < pool.length; j++ ) {
			if( pool[j].id == socket.partner.id ) {
				pool.splice( j - 1, 1 );
				socket.inPool = null;
			}
		}

		socket.partner.emit( 'partner disconnected' );
		socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } );
		socket.partner.partner = null;
		socket.partner = null;
	}
}

connect = function( socket ) {
	socket.score = Math.floor( ( Math.random() * 100 ) + 1 );

	//if there are users in the pool, take one of them and make them your
	//partner. If not, jump in the pool.
	virtualConnect( socket );

	socket.on( 'virtual connection', function() {
		virtualConnect( socket );
	});

	//what to do when the user disconnects (through leaving the page: full disconnect)
	socket.on( 'disconnect', function() {
		virtualDisconnect( socket );	
	});

	//what to do when the user disconnects (through hitting the disconnect button: virtual disconnect)
	socket.on( 'virtual disconnect', function() {
		virtualDisconnect( socket );
	});
		
	//when server recieves 'send' relay 'message' to client
	//'send' is a chat message coming from a client, and
	//'message' is a chat message being sent from the server to a client.
	socket.on( 'send', function( data ) {
		data.type = 'partner';
		if( socket.partner ) {
			socket.partner.emit( 'message', data  );
		}
	});
}


//what to do when the socket connects (this also bootstraps the rest of the protocol)
io.of( '/main' ).on( 'connection', function( socket ) {
	connect( socket );
});

for( var i=0; i < 500; i++ ) {
	io.of( '/sim/' + i ).on( 'connection', function( socket ) {
		connect( socket );
	});
}
