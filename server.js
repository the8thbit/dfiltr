//=============================================================================
// SERVER START UP
//=============================================================================
var config       = require( './config.js' )
var express      = require( 'express' )
var stylus       = require( 'stylus' )
var passport     = require( 'passport' )
var passportSIO  = require( 'passport.socketio' );
var sessionStore = require( 'sessionstore' )
var passConfig   = require( './server/passConfig.js' )( passport )
var db           = require( './server/schemas/mainDB.js' )
var pio          = require( 'predictionio' ) ( {
	key: config.PIO_API_KEY,
	baseUrl: config.PIO_API_HOST
})

if( pio.users && pio.items ) {
	pio.users.num = 0
	pio.items.num = 0
	pio.ITEMS_PER_USER = 5
} else {
	pio.users = 0
	pio.items = 0
	pio.users.num = 0
	pio.items.num = 0
	pio.ITEMS_PER_USER = 5
}

//use the express app engine
var app = express()
app.use( express.urlencoded() )
app.use( express.cookieParser() )
sessionStore.mongo = sessionStore.createSessionStore( {
	type:     'mongoDb',
	username: config.MONGO_USER,
	password: config.MONGO_PASS,
	host:     config.MONGO_IP,
	port:     config.MONGO_PORT,
	dbName:   config.MONGO_DB_NAME,
	collectionName: 'sessions'
});
app.use( express.session( { 
	key: '435.sid',
	secret: config.COOKIE_SECRET,
	store: sessionStore.mongo
}));

//use stylus templates for CSS
function compile( str, path ) { return stylus( str ).set( 'filename', path ); } 
app.use( stylus.middleware( { src: __dirname + '/' , compile: compile } ) );
app.use( express.static( __dirname + '/' ) );

//use pasport for managing user authentication and sessions
app.use( passport.initialize() );
app.use( passport.session() );

//use jade templates for HTML
app.set( 'views', __dirname + '/client' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require( 'jade' ).__express );

//get the JADE template pages used in the project
app.get( '/',                    function( req, res ) { res.render( 'chat/chat'                ); } );
app.get( '/user',                function( req, res ) { res.render( 'profile/profile'          ); } );
app.get( '/profile/delta',       function( req, res ) { res.render( 'profile/delta/delta'      ); } );
app.get( '/profile/badges',      function( req, res ) { res.render( 'profile/badges/badges'    ); } );
app.get( '/profile/badges/view', function( req, res ) { res.render( 'profile/badges/view/view' ); } );

app.get( '/modules/ratings',     function( req, res ) { res.render( 'modules/ratings/ratings'  ); } );
app.get( '/modules/dock/auth',   function( req, res ) { res.render( 'modules/dock/dock_in'     ); } );
app.get( '/modules/dock',        function( req, res ) { res.render( 'modules/dock/dock_out'    ); } );
app.get( '/modules/login',       function( req, res ) { res.render( 'modules/login/login'      ); } );
app.get( '/modules/convo',       function( req, res ) { res.render( 'modules/convo/convo'      ); } );
app.get( '/modules/convols',     function( req, res ) { res.render( 'modules/convols/convols'  ); } );

app.get('/user/:username',       function( req, res ) {
	User.findOne( { username: req.params.username }, function( err, user ) {
		if( user && user.username ) {
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges
				}
			})
		} else {
			res.render( 'chat/chat' );
		}
	})
})

//use socket.io and give it a location to listen on 
var io = require( 'socket.io' ).listen( app.listen( config.SERVER_PORT, config.SERVER_IP ) );
io.set( 'log level', 1 );
io.set( 'browser client minification', true );
io.set( 'browser client etag', true );
//use passport.socket.io to link passport sessions with a socket
io.set( 'authorization', passportSIO.authorize( {
	cookieParser: express.cookieParser,
	key:          '435.sid',
	secret:       config.COOKIE_SECRET,
	store:        sessionStore.mongo,
	fail:         onAuthorizeFail
}));
function onAuthorizeFail( data, message, error, accept ){ accept( null, true ) }
console.log( 'listening at ' + config.SERVER_IP + ' on port ' + config.SERVER_PORT )

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//=============================================================================
// CHAT PROTOCOL
//=============================================================================
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var ptcl = new Object()
ptcl.pool = [] //pool of unpaired users

//-----------------------------------------------------------------------------
// what to do when the socket connects
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
io.of( '/main' ).on( 'connection', function( socket ) { ptcl.connect( socket ) } )

//-----------------------------------------------------------------------------
// what to do when bot sockets connect
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
for( var i=0; i < 100; i++ ) {
	io.of( '/sim/' + i ).on( 'connection', function( socket ) {
		ptcl.connect( socket )
	})
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
ptcl.connect = function( socket ) {
	socket.user = socket.handshake.user
	Client.findOne( { ip: socket.handshake.address.address }, function( err, res ) { socket.client = res } )

	if( !socket.client ) {
		socket.client = new Client( {
			ip: socket.handshake.address.address,
			flags: 0
		}) 
		socket.client.save()
	}

	ptcl.virtualConnect( socket )
	socket.on( 'virtual connection', function() { ptcl.virtualConnect( socket )    } )
	socket.on( 'disconnect',         function() { ptcl.virtualDisconnect( socket ) } ) //user disconnects through leaving the page: full disconnect
	socket.on( 'virtual disconnect', function() { ptcl.virtualDisconnect( socket ) } ) //user disconnects through hitting the disconnect button: virtual disconnect
		
	socket.on( 'send', function( data ) {        	//when server recieves 'send' relay 'message' to client
		data.type = 'partner'                       	//'send' is a chat message coming from a client, and
		if( socket.partner ) {                       //'message' is a chat message being sent from the server to a client.
			socket.partner.emit( 'message', data  )
			if( socket.convo ) {
				socket.convo.users[0] = socket.user.username;
				socket.convo.messages.push( {
					userId: 0,
					message: data.message
				});
			} else if( socket.partner.convo ) {
				socket.partner.convo.users[1] = socket.partner.user.username;
				socket.partner.convo.messages.push( {
					userId: 1,
					message: data.message
				});
			}
		}
	})

	//what to do when the user provides a rating
	socket.on( 'rate', function( data ) {
		if( socket.prev_partner ) {
			if( data.rating == 'delta' ) {
				if( socket.prev_partner.pio_items ) {
					pio.users.createAction( {
						pio_engine: 'engine',
						pio_uid: socket.pio_user,
						pio_iid: socket.prev_partner.pio_items[Math.floor( Math.random() * socket.prev_partner.pio_items.length )],
						pio_action: 'like',
						pio_rate: '5'
					}, function( err, res ) {
						console.log( err, res )
					})
				}
				if( socket.prev_convo ) {
					socket.prev_convo.deltas[1]++;
					socket.prev_convo.deltas[2]++;
					socket.prev_convo.save();
					socket.prev_convo = null;
				} else if( socket.prev_partner.prev_convo ) {
					socket.prev_partner.prev_convo.deltas[0]++;
					socket.prev_partner.prev_convo.deltas[2]++;
					socket.prev_partner.prev_convo.save();
					socket.prev_partner.prev_convo = null;
				}
				
				socket.prev_partner.user.deltas++;
				socket.prev_partner.user.save();
				socket.prev_partner = null;
			} else if( data.rating == 'same' && socket.prev_partner.pio_items ) {
				pio.users.createAction( {
					pio_engine: 'engine',
					pio_uid: socket.pio_user,
					pio_iid: socket.prev_partner.pio_items[Math.floor( Math.random() * socket.prev_partner.pio_items.length )],
					pio_action: 'dislike',
					pio_rate: '1'
				}, function( err, res ) {
					console.log( err, res )
					socket.prev_partner = null
				})
			} else if( data.rating == 'flag' ) {
				socket.prev_partner.client.flags++
				if( socket.prev_partner.user ) { socket.prev_partner.user.flags++ }
				socket.prev_partner = null				
			}
		}
	})
}

//-----------------------------------------------------------------------------
// add user to pool and start attempts to connect to a partner
//-----------------------------------------------------------------------------
ptcl.virtualConnect = function( socket ) {
	//throw the user in the pool
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } )
	socket.inPool = ptcl.pool.push( socket )
	var recommends = ptcl.getRecommends( socket.user.pio_user )
	var pickiness = 0.96
	//periodically scan pool for matches
	socket.retry = setInterval( function() {
		pickiness -= 1.00 - pickiness
		ptcl.scanPool( socket, recommends, pickiness )
	}, 1000 )
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
ptcl.virtualDisconnect = function( socket ) {		
	clearInterval( socket.retry )
	for( var j=0; j < ptcl.pool.length; j++ ) {
		if( ptcl.pool[j].id == socket.id ) {
			ptcl.pool.splice( j - 1, 1 )
			socket.inPool = null
		}
	}
	
	if( socket.partner ) {
		clearInterval( socket.partner.retry )

		for( var j=0; j < ptcl.pool.length; j++ ) {
			if( ptcl.pool[j].id == socket.partner.id ) {
				ptcl.pool.splice( j - 1, 1 )
				socket.inPool = null
			}
		}
		socket.partner.emit( 'partner disconnected' )
		socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } )

		if( socket.convo ) {
			socket.convo.save();
			socket.convo = null;
		};

		if( socket.partner.convo ) {
			socket.partner.convo.save();
			socket.partner.convo = null;
		};

		socket.prev_convo = socket.convo;
		socket.partner.prev_convo = socket.convo;

		socket.prev_convoId = socket.convoId;
		socket.partner.prev_convoId = socket.partner.convoId;

		socket.partner.prev_partner = socket;
		socket.prev_partner = socket.partner;

		socket.convo = null;
		socket.partner.convo = null;

		socket.prev_convoId = null;
		socket.partner.prev_convoId = null;

		socket.partner.partner = null;
		socket.partner = null;
	};
}

//-----------------------------------------------------------------------------
// try to connect to a partner
//-----------------------------------------------------------------------------
ptcl.scanPool = function( socket, recommends, pickiness ) {
	socket.emit( 'message', { message: '...', type: 'debug' } )
	if( partner = ptcl.findPartner( socket, recommends, pickiness ) ) { //set partner equal to ptcl.findPartner() and then check if partner exists
		ptcl.handshake( socket, partner );
	}	
}

//-----------------------------------------------------------------------------
// scan the pool for a suitable partner
//-----------------------------------------------------------------------------
ptcl.findPartner = function( socket, recommends, pickiness ) {
	if( !socket.partner && socket.inPool && ptcl.pool.length > 1 ) {
		var partner

		if( recommends && !recommends.message && recommends.length > 0 && pickiness >= 0 && Math.random < 0.9 ) {
			var matchNum = Math.floor( ( 1 - pickiness ) * 50 ) //the total number of matches to compare against, as determined by our current pickiness
			if( matchNum < recommends.length ) {
				var matches = recommends.slice( 0, matchNum )
			} else { var matches = recommends }

			var cannidates = [] //users that are both in the pool and matches
			for( var i=0; i < ptcl.pool.length; i++ ) {
				for( var j=0; j < matches.length; j++ ) {
					for( var k=0; k < ptcl.pool[i].pio_items.length; k++ ) {
						if( ptcl.pool[i].pio_items[k] == matches[j] ) {
							cannidates.push( ptcl.pool[i] )
						}
					}
				}
			}

			if( cannidates.length > 0 ) {
				partner = cannidates[Math.floor( Math.random() * cannidates.length ) + 1]
			}
		} else { //if you don't have a suitable list of recommendations, just pick the user which has been waiting the longest
			partner = ptcl.pool[0]
		}
	}

	return partner
}

//-----------------------------------------------------------------------------
// get a list of recommended user items for the user based on ratings history
//-----------------------------------------------------------------------------
ptcl.getRecommends = function( pio_user ) {
	pio.items.recommendation( {
		pio_engine: 'engine',
		pio_uid: pio_user,
		pio_n: 50
	}, function( err, recommends ) {
		console.log( err );
		return recommends
	})
}

//-----------------------------------------------------------------------------
// once a partner has been found, set up the connection between socket and partner
//-----------------------------------------------------------------------------
ptcl.handshake = function( socket, partner ) {
	if( partner && !partner.partner && partner != socket ) {
		socket.partner = partner
		clearInterval( socket.partner.retry )
		clearInterval( socket.retry )
		
		for( var j=0; j < ptcl.pool.length; j++ ) {
			if( ptcl.pool[j].id == socket.id ) {
				ptcl.pool.splice( j-1, 1 )
				socket.inPool = null
			} else if( ptcl.pool[j].id == socket.partner.id ) {
				ptcl.pool.splice( j-1, 1 )
				socket.partner.inPool = null
			}
		}
		
		socket.partner.partner = socket
		
		Topic.find().exec( function( err, topics ) {
			Topic.count().exec( function( err, count ) {
				socket.convo = new Convo( { topic: topics[Math.floor( Math.random() * count )].text } );

				socket.convoId = 0
				socket.partner.convoId = 1
		
				socket.emit( 'partner connected' )
				socket.partner.emit( 'partner connected' )
				
				socket.partner.emit( 'message', { message: 'You\'ve found a partner.',            type: 'server' } )
				socket.partner.emit( 'message', { message: 'partner\'s ID: '    + socket.id,      type: 'debug'  } )
				socket.partner.emit( 'message', { message: 'You were picked from the pool.',      type: 'debug'  } )
				socket.partner.emit( 'message', { message: socket.convo.topic,                    type: 'server' } )
				
				socket.emit(         'message', { message: 'You\'ve found a partner.',            type: 'server' } )
				socket.emit(         'message', { message: 'partner\'s ID: ' + socket.partner.id, type: 'debug'  } )
				socket.emit(         'message', { message: 'You were the picker.',                type: 'debug'  } )
				socket.emit(         'message', { message: socket.convo.topic,                    type: 'server' } )
			});
		});
	} else if( !socket.inPool && socket.retry ) { 
		clearInterval( socket.retry )
	}
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//=============================================================================
// AUTHENTICATION PROTOCOL
//=============================================================================
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
createUser = function( body ) {
	var newUser = new User( {
		username:  body.username,
		password:  body.password,
		email:     body.email,
		pio_user:  null,
		pio_items: [],
		flags:     0,
		deltas:    0,
		badges:    0,
	})

	User.count( {}, function( err, res ) { 
		pio.users.num = res;
		pio.items.num = res * pio.ITEMS_PER_USER;
		//create the predictionio user and items associated with the scoket
		pio.users.num++;
		pio.users.create( {
			pio_uid: pio.users.num,
			pio_inactive: false
		}, function( err, res ) {
			console.log( err, res );
			newUser.pio_user = pio.users.num;
			var race_condition_stopper = 0;
			for( var i=0; i < pio.ITEMS_PER_USER; i++ ) {
				pio.items.num++;
				pio.items.create( {
					pio_iid: pio.items.num,
					pio_itypes: 'uitem',
					pio_inactive: false
				}, function( err, res ) {
					if( err ) { console.log( err ); }
					newUser.pio_items.push( pio.items.num );
					race_condition_stopper++;
					if( race_condition_stopper == pio.ITEMS_PER_USER ) {
						newUser.save();
					}
				})
			}
		})
	})
}

app.get( '/login', function( req, res, next ) {
	passport.authenticate( 'local', function( err, user, info ) {
		if( info && info.message == 'bad name' ) {
			res.send( 'bad name' )
		} else if( info && info.message == 'bad pass' ) {
			res.send( 'bad pass' )
		} else if( user ) {
			req.logIn( user, function( err ) { 
				if( err ) { 
					console.log( 'login error: ' + err )
					res.send( err ) 
				} else {
					res.send( user )
				}
			})
		} else { 
			res.send( 'login error' )
			console.log( 'login error: ' + err )
		}
	})( req, res, next )
})

app.post( '/register', function( req, res, next ) {
	//does the username exist already?
	User.findOne( { username: req.body.username }, function( err, user ) {
		if( err ) {
			console.log( 'registration error: ' + err )
			return res.send( err )
		} else if( user ) {
			return res.send( 'bad name' ) 
		} else {
			//does the email exist already?
			User.findOne( { email: req.body.email }, function( err, user ) {
				if( err ) {
					console.log( 'registration error: ' + err )
					return res.send( err )
				} else if( req.body.email && user ) {
					return res.send( 'bad email' )
				} else {
					createUser( req.body )
					return res.send( 'success' )
				}					
			})
		}
	})
})

app.get( '/isLogged', function( req, res, next ) {
	if( req.user ) {
		return res.send( req.user )
	} else {
		return res.send( false )
	}
})

/////////////////////////////
//Mongo queries
/////////////////////////////
app.get( '/mongo/profile/delta', function( req, res, next ) {
	Convo.find( { users: {$in: [req.query.name]} }, function( err, convos ) {
		res.send( convos );
	})
})
