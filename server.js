//=============================================================================
// SERVER START UP
//=============================================================================
var config     = require( './config.js' );
var express    = require( 'express' );
var stylus     = require( 'stylus' );
var passport   = require( 'passport' );
var passConfig = require( './server/passConfig.js' )( passport );
var db         = require( './server/schemas/mainDB.js' );

/*var brain   = require( 'predictionio' ) ( {
	key: '3YVm7gr7UrYGA0TaarlBqFjF6IpX9Y90gQvUD7TgwSRADiFUyMhXsxQ1w7EPkcOz',
	baseUrl: 'http://localhost:8001'
})*/

//use the express app engine
var app = express();

//use stylus templates for CSS
function compile( str, path ) { return stylus( str ).set( 'filename', path ); } 
app.use( stylus.middleware( { src: __dirname + '/' , compile: compile } ) )
app.use( express.static( __dirname + '/' ) );

//use pasport for managing user authentication and sessions
app.use( express.bodyParser() );
app.use( express.cookieParser( 'your secret here' ) );
app.use( passport.initialize() );
app.use( passport.session() );

//use jade templates for HTML
app.set( 'views', __dirname + '/client' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require( 'jade' ).__express );

//get the JADE template pages used in the project
app.get( '/', function( req, res ){ res.render( 'chat/chat' ); } );
app.get( '/modules/ratings',   function( req, res ){ res.render( 'modules/ratings/ratings' ); } );
app.get( '/modules/auth/dock', function( req, res ){ res.render( 'modules/dock/dock_in'    ); } );
app.get( '/modules/dock',      function( req, res ){ res.render( 'modules/dock/dock_out'   ); } );
app.get( '/modules/login',     function( req, res ){ res.render( 'modules/login/login'   ); } );

//use socket.io and give it a location to listen on 
var io = require( 'socket.io' ).listen( app.listen( config.SERVER_PORT, config.SERVER_IP ) );
io.configure( function() { io.set( 'transports', [ 'websocket' ] ); } ); //turn websockets on
console.log( 'listening at ' + config.SERVER_IP + ' on port ' + config.SERVER_PORT );

app.post( '/login', passport.authenticate( 'local', { 
	successRedirect: '/SUCCESS/',
	failureRedirect: '/failure/',
}));


//=============================================================================
// CHAT PROTOCOL
//=============================================================================
var ptcl = new Object();
ptcl.pool = []; //pool of unpaired users

//-----------------------------------------------------------------------------
// what to do when the socket connects
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
io.of( '/main' ).on( 'connection', function( socket ) {
	ptcl.connect( socket );
});

//-----------------------------------------------------------------------------
// what to do when bot sockets connect
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
for( var i=0; i < 100; i++ ) {
	io.of( '/sim/' + i ).on( 'connection', function( socket ) {
		ptcl.connect( socket );
	});
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
ptcl.connect = function( socket ) {
	socket.scores = [];

	//if there are users in the pool, take one of them and make them your
	//partner. If not, jump in the pool.
	ptcl.virtualConnect( socket );

	socket.on( 'virtual connection', function() {
		ptcl.virtualConnect( socket );
	});

	//what to do when the user disconnects (through leaving the page: full disconnect)
	socket.on( 'disconnect', function() {
		ptcl.virtualDisconnect( socket );	
	});

	//what to do when the user disconnects (through hitting the disconnect button: virtual disconnect)
	socket.on( 'virtual disconnect', function() {
		ptcl.virtualDisconnect( socket );
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

//-----------------------------------------------------------------------------
// add user to pool and start attempts to connect to a partner
//-----------------------------------------------------------------------------
ptcl.virtualConnect = function( socket ) {
	socket.emit( 'message', { message: 'your ID:' + socket.id,     type: 'debug'  } );
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );
	socket.inPool = ptcl.pool.push( socket );

	socket.retry = setInterval( function() {
		ptcl.connectAttempt( socket );
	}, 1000 );
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
ptcl.virtualDisconnect = function( socket ) {		
	clearInterval( socket.retry );
	for( var j=0; j < ptcl.pool.length; j++ ) {
		if( ptcl.pool[j].id == socket.id ) {
			ptcl.pool.splice( j - 1, 1 );
			socket.inPool = null;
		}
	}
	
	if( socket.partner ) {
		clearInterval( socket.partner.retry );

		for( var j=0; j < ptcl.pool.length; j++ ) {
			if( ptcl.pool[j].id == socket.partner.id ) {
				ptcl.pool.splice( j - 1, 1 );
				socket.inPool = null;
			}
		}

		socket.partner.emit( 'partner disconnected' );
		socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } );
		socket.partner.partner = null;
		socket.partner = null;
	}
}

//-----------------------------------------------------------------------------
// try to connect to a partner
//-----------------------------------------------------------------------------
ptcl.connectAttempt = function( socket ) {
	socket.emit( 'message', { message: '...', type: 'debug' } );
	if( partner = ptcl.findPartner( socket ) ) {
		ptcl.handshake( socket, partner );
	}	
}

//-----------------------------------------------------------------------------
// scan the pool for a suitable partner
//-----------------------------------------------------------------------------
ptcl.findPartner = function( socket ) {
	if( !socket.partner && socket.inPool ) {
		var partner;
		for( var i=0; i < ptcl.pool.length; i++ ) {
			//if there's no score for pool member create score for him
			if( socket.scores[ptcl.pool[i].id] ) {
				socket.scores[ptcl.pool[i].id] = ( Math.random() * 100 ) + 1;
			}
			//if pool member doesn't have a score for you, create one
			if( !ptcl.pool[i].scores[socket.id] ) {
				ptcl.pool[i].scores[socket.id] = ( Math.random() * 100 ) + 1;		
			}
			//update partner with new best match
			if( !partner || socket.scores[ptcl.pool[i].id] > socket.scores[partner.id] ) {
				if( ptcl.pool[i] != socket ) { partner = ptcl.pool[i]; }
			}
		}			
		return partner;
	}
}

//-----------------------------------------------------------------------------
// once a partner has been found, set up the connection between socket
// and partner
//-----------------------------------------------------------------------------
ptcl.handshake = function( socket, partner ) {
	var scoreAvg = ( socket.scores[partner.id] + partner.scores[socket.id] ) / 2;
	if( partner && !partner.partner && scoreAvg > Math.random() * 80 ) {
		socket.partner = partner;
		clearInterval( socket.partner.retry );
		clearInterval( socket.retry );

		for( var j=0; j < ptcl.pool.length; j++ ) {
			if( ptcl.pool[j].id == socket.id ) {
				ptcl.pool.splice( j-1, 1 );
				socket.inPool = null;
			} else if( ptcl.pool[j].id == socket.partner.id ) {
				ptcl.pool.splice( j-1, 1 );
				socket.partner.inPool = null;
			}
		}
			
		socket.partner.partner = socket;

		socket.partner.emit( 'message', { message: 'You\'ve been paired with a partner.',                     type: 'server' } );
		socket.partner.emit( 'message', { message: 'partner\'s score: ' + socket.partner.scores[socket.id],   type: 'debug'  } );
		socket.partner.emit( 'message', { message: 'partner\'s ID: '    + socket.id,                          type: 'debug'  } );
		socket.partner.emit( 'message', { message: 'You were picked from the pool.',                          type: 'debug'  } );

		socket.emit( 'message', { message: 'You\'ve been paired with a partner.',                   type: 'server' } );
		socket.emit( 'message', { message: 'partner\'s score: ' + socket.scores[socket.partner.id], type: 'debug'  } );
		socket.emit( 'message', { message: 'partner\'s ID: ' + socket.partner.id,                   type: 'debug'  } );
		socket.emit( 'message', { message: 'You were the picker.',                                  type: 'debug'  } );
				
		socket.emit( 'partner connected' );
		socket.partner.emit( 'partner connected' );
	} else if( !socket.inPool && socket.retry ) { 
		clearInterval( socket.retry );
	}
}
