//====================================
//SERVER START UP
//====================================
var config  = require( './config.js' );
var express = require( 'express' );
var stylus  = require( 'stylus' );
var schema = require('./schemas/mainDB.js');
var http    = require( 'http' );

var brain   = require( 'predictionio' ) ( {
	key: '3YVm7gr7UrYGA0TaarlBqFjF6IpX9Y90gQvUD7TgwSRADiFUyMhXsxQ1w7EPkcOz',
	baseUrl: 'http://localhost:8001'
})

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
var pool        = [];    //pool of unpaired users
brain.userList = [];
brain.itemList = [];

virtualConnect = function( socket ) {
	socket.brainUser;
	socket.brainItems = [];
	var ERROR_CHECK = function( err, res ) {
		if( err ) console.log( err );
		if( res ) console.log( res );
	}

	brain.users.create( { pio_uid: brain.userList.length + 1, pio_inactive: false }, ERROR_CHECK );
	brain.userList.push( brain.users.get( brain.userList.length, ERROR_CHECK ) );
	console.log( brain.userList[brain.userList.length - 1] );

	socket.brainUser = brain.userList[brain.userList.length - 1];
	//console.log( socket.brainUser );

	for( var i=0; i < 5; i++ ) {
		brain.items.create( { pio_iid: brain.itemList.length + 1, pio_itypes: 'user', pio_inactive: false }, ERROR_CHECK );
		brain.itemList.push(
			brain.items.get( brain.itemList.length, ERROR_CHECK )
		);
		socket.brainItems.push( brain.itemList[this.length] );
	}

	socket.emit( 'message', { message: 'your ID:' + socket.id, type: 'debug' } );
	socket.inPool = pool.push( socket );
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );

	socket.retry = setInterval( function() {
		socket.emit( 'message', { message: '...', type: 'debug' } );
		if( !socket.partner && socket.inPool ) {
			var partner, isNew = true;
			for( var i=0; i < pool.length; i++ ) {
				for( var j=0; j < socket.scores.length; j++ ) {
					if( pool[i] == socket.scores[j] ) {
						isNew = false;
					}
				}

				if( isNew ) {
					socket.scores[pool[i].id] = ( Math.random() * 100 ) + 1;
				}

				if( partner && !partner.scores[socket.id] ) {
					partner.scores[socket.id] = ( Math.random() * 100 ) + 1;					
				}

				if( ( !partner || socket.scores[pool[i].id] > socket.scores[partner.id] ) && pool[i] != socket ) {
					partner = pool[i];
				}
			}

			if( partner && ( socket.scores[partner.id] + partner.scores[socket.id] ) > Math.random() * 160 ) {
				socket.partner = partner;
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
				socket.partner.emit( 'message', { message: 'partner\'s score: ' + socket.partner.scores[socket.id],   type: 'debug' } );
				socket.partner.emit( 'message', { message: 'partner\'s ID: ' + socket.id,         type: 'debug' } );
				socket.partner.emit( 'message', { message: 'You were picked from the pool.',      type: 'debug' } );

				socket.emit( 'message', { message: 'You\'ve been paired with a partner.',       type: 'server' } );
				socket.emit( 'message', { message: 'partner\'s score: ' + socket.scores[socket.partner.id], type: 'debug' } );
				socket.emit( 'message', { message: 'partner\'s ID: ' + socket.partner.id,       type: 'debug' } );
				socket.emit( 'message', { message: 'You were the picker.',                      type: 'debug' } );
				
				socket.emit( 'partner connected' );
				socket.partner.emit( 'partner connected' );
			} else if( !socket.inPool ) { 
				clearInterval( socket.retry );
			}
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
	socket.scores = [];

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

for( var i=0; i < 100; i++ ) {
	io.of( '/sim/' + i ).on( 'connection', function( socket ) {
		connect( socket );
	});
}
