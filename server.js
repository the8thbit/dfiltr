//=============================================================================
// SERVER START UP
//=============================================================================
var config       = require( './config.js' );
var express      = require( 'express' );
var stylus       = require( 'stylus' );
var passport     = require( 'passport' );
var passportSIO  = require( 'passport.socketio' );
var sessionStore = require( 'sessionstore' );
var passConfig   = require( './server/passConfig.js' )( passport );
var db           = require( './server/schemas/mainDB.js' );
var speakeasy    = require( 'speakeasy-nlp' );
var pio          = require( 'predictionio' )( {
	key: config.PIO_API_KEY,
	baseUrl: config.PIO_API_HOST
});

pio.ITEMS_PER_USER = 5;
new Index( { name: 'pio_users' } ).save( function(){
	new Index( { name: 'pio_items' } ).save( function(){
		Index.findOne( { name: 'pio_users' }, function( err, index ){
			if( err ){ console.log( err ); } else {
				pio.users.index = index;
			}
		});
		Index.findOne( { name: 'pio_items' }, function( err, index ){
			if( err ){ console.log(err); } else {
				pio.items.index = index;
			}
		});
	});
});

//use the express app engine
var app = express();
app.use( express.urlencoded() );
app.use( express.cookieParser() );
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
function compile( str, path ){ return stylus( str ).set( 'filename', path ); } 
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
app.get( '/',                               function( req, res ){ res.render( 'chat/chat'                                   ); } );
app.get( '/help',                           function( req, res ){ res.render( 'help/help'                                   ); } );
app.get( '/profile/convos',                 function( req, res ){ res.render( 'profile/convos/convos'                       ); } );
app.get( '/profile/convos/convoListElm',    function( req, res ){ res.render( 'profile/convos/convoListElm/convoListElm'    ); } );
app.get( '/profile/convos/convo',           function( req, res ){ res.render( 'profile/convos/convo/convo'                  ); } );
app.get( '/profile/badges',                 function( req, res ){ res.render( 'profile/badges/badges'                       ); } );
app.get( '/profile/badges/badgeView',       function( req, res ){ res.render( 'profile/badges/badgeView/badgeView'          ); } );
app.get( '/profile/options',                function( req, res ){ res.render( 'profile/options/options'                     ); } );
app.get( '/profile/mail',                   function( req, res ){ res.render( 'profile/mail/mail'                           ); } );
app.get( '/profile/mail/mailListElm',       function( req, res ){ res.render( 'profile/mail/mailListElm/mailListElm'        ); } );
app.get( '/profile/mail/mailConvo',         function( req, res ){ res.render( 'profile/mail/mailConvo/mailConvo'            ); } );
app.get( '/profile/mail/mailInput',         function( req, res ){ res.render( 'profile/mail/mailInput/mailInput'            ); } );
app.get( '/scoreboard/users',               function( req, res ){ res.render( 'scoreboard/users/users'                      ); } );
app.get( '/scoreboard/users/userListElm',   function( req, res ){ res.render( 'scoreboard/users/userListElm/userListElm'    ); } );
app.get( '/scoreboard/convos',              function( req, res ){ res.render( 'scoreboard/convos/convos'                    ); } );
app.get( '/scoreboard/convos/convoListElm', function( req, res ){ res.render( 'scoreboard/convos/convoListElm/convoListElm' ); } );
app.get( '/scoreboard/convos/convo',        function( req, res ){ res.render( 'scoreboard/convos/convo/convo'               ); } );
app.get( '/scoreboard/badges',              function( req, res ){ res.render( 'scoreboard/badges/badges'                    ); } );
app.get( '/scoreboard/badges/badgeView',    function( req, res ){ res.render( 'scoreboard/badges/badgeView/badgeView'       ); } );
app.get( '/modules/ratings',                function( req, res ){ res.render( 'modules/ratings/ratings'                     ); } );
app.get( '/modules/dock/auth',              function( req, res ){ res.render( 'modules/dock/dock_in'                        ); } );
app.get( '/modules/dock',                   function( req, res ){ res.render( 'modules/dock/dock_out'                       ); } );
app.get( '/modules/login',                  function( req, res ){ res.render( 'modules/login/login'                         ); } );


app.get( '/user', function( req, res ){ res.render( 'profile/profile' ); } );
// create the paths for all of the user profile pages
app.get( '/user/:username', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		if( user ){
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get( '/user/:username/convos', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		if( user ){
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges,
					view: 'convos'
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get( '/user/:username/convos/:convo', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		Convo.findOne( { _id: req.params.convo }, function( err, convo ){
			if( user && convo ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'convo',
						convo: JSON.stringify( convo )
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});
});

app.get( '/user/:username/badges', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		if( user ){
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges,
					view: 'badges'
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get( '/user/:username/mail', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		if( user ){
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges,
					view: 'mail'
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get('/user/:username/mail/:to', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		Mail.findOne( { to: req.params.to }, function( err, mail ){
			if( user && mail ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'mailConvo',
						convo: JSON.stringify( mail )
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});
});

app.get('/user/:username/options', function( req, res ){
	User.findOne( { username: req.params.username }, function( err, user ){
		if( user ){
			res.render('profile/profile', {
				profileData: {
					name: user.username,
					deltas: user.deltas,
					badges: user.badges,
					view: 'options'
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get( '/stats', function( req, res ){
	res.render('scoreboard/scoreboard', {
		scoreboardData: {}
	});
});

app.get( '/stats/users', function( req, res ){
	res.render('scoreboard/scoreboard', {
		scoreboardData: { view: 'users' }
	});
});

app.get( '/stats/convos', function( req, res ){
	res.render('scoreboard/scoreboard', {
		scoreboardData: { view: 'convos' }
	});
});

app.get( '/stats/convos/:convo', function( req, res ){
	Convo.findOne( { _id: req.params.convo }, function( err, convo ){
		if( convo ){
			res.render('scoreboard/scoreboard', {
				scoreboardData: {
					view: 'convo',
					convo: JSON.stringify( convo )
				}
			});
		} else {
			res.render( 'chat/chat' );
		}
	});
});

app.get( '/stats/badges', function( req, res ){
	res.render('scoreboard/scoreboard', {
		scoreboardData: { view: 'badges' }
	});
});

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
function onAuthorizeFail( data, message, error, accept ){ accept( null, true ); }
console.log( 'listening at ' + config.SERVER_IP + ' on port ' + config.SERVER_PORT );

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//=============================================================================
// CHAT PROTOCOL
//=============================================================================
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var chat = {};
var mail = {};
chat.pool = []; //pool of unpaired users

//-----------------------------------------------------------------------------
// what to do when the socket connects
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
io.of( '/main' ).on( 'connection', function( socket ){ chat.connect( socket ); } );
io.of( '/mail' ).on( 'connection', function( socket, partner ){ mail.connect( socket ); } );

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
mail.connect = function( socket ){
	socket.user = socket.handshake.user;

	socket.on( 'partner', function( name ){
		User.findOne( { username: name }, function( err, user ){
			socket.partner = user;
			socket.room = socket.user.username + '@' + socket.partner.username;
			socket.join( socket.room ); //the socket joins a room identified by the combination of its username and its partners name
		});
	});

	socket.on( 'disconnect', function(){
		socket.leave( socket.room );
		socket.partner = null;
		socket.room = null;
		socket = null;
	});

	socket.on( 'virtual disconnect', function(){
		socket.leave( socket.room );
		socket.partner = null;
		socket.room = null;
	});

	//when server recieves 'send' relay 'message' to client 'send' is a mail message coming from a client, and 'message' is a mail message being sent from the server to a client.
	socket.on( 'send', function( data ){
		if( socket.partner ){
			data.type = 'partner';			
			socket.broadcast.to( socket.partner.username + '@' + socket.user.username ).emit( 'message', data );
			Mail.findOne( { to: socket.partner.username, from: socket.user.username }, function( err, mail ){
				if( !mail ){
					mail = new Mail( {
						to: socket.partner.username,
						from: socket.user.username
					});
				}
				mail.messages.push( {
					userId: 0,
					message: data.message
				});
				mail.messageNum += 1;
				mail.save();
			});
			Mail.findOne( { to: socket.user.username, from: socket.partner.username }, function( err, mail ){
				if( !mail ){
					mail = new Mail( {
						to: socket.user.username,
						from: socket.partner.username
					});
				}
				mail.messages.push( {
					userId: 1,
					message: data.message
				});
				mail.messageNum += 1;
				mail.newMessages += 1;
				mail.save();
			});
		}
	});

	socket.on( 'clear new', function( to ){
		Mail.findOne( { to: to, from: socket.user.username }, function( err, mail ){
			if( mail ){
				mail.dateAccessed = Date.now();
				mail.newMessages = 0;
				mail.save();
				Convo.findByIdAndUpdate( mail._id, { newMessages: 0 }, function( err ){ if( err ){ console.log( err ); } } );
			}
		});
	});
};

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
chat.connect = function( socket ){
	socket.user = socket.handshake.user;
	Client.findOne( { ip: socket.handshake.address.address }, function( err, res ){ socket.client = res; } );

	if( !socket.client ){
		socket.client = new Client( {
			ip: socket.handshake.address.address,
			flags: 0
		});
		socket.client.save();
	}

	chat.virtualConnect( socket );
	socket.on( 'virtual connection', function(){ chat.virtualConnect( socket );    } );
	socket.on( 'disconnect',         function(){ chat.virtualDisconnect( socket ); } ); //user disconnects through leaving the page: full disconnect
	socket.on( 'virtual disconnect', function(){ chat.virtualDisconnect( socket ); } ); //user disconnects through hitting the disconnect button: virtual disconnect
		
	socket.on( 'send', function( data ){           //when server recieves 'send' relay 'message' to client
		data.type = 'partner';                       //'send' is a chat message coming from a client, and
		if( socket.partner ){                        //'message' is a chat message being sent from the server to a client.
			socket.partner.emit( 'message', data );
			if( socket.convo ){
				socket.convo.users[0] = socket.user.username; 
				socket.convo.messages.push( {
					userId: 0,
					message: data.message,
				});
				socket.convo.size += 1;
			} else if( socket.partner.convo ){
				socket.partner.convo.users[1] = socket.user.username;
				socket.partner.convo.messages.push( {
					userId: 1,
					message: data.message,
				});
				socket.partner.convo.size += 1;
			}
		}
	});

	//what to do when the user provides a rating
	socket.on( 'rate', function( data ){
		if( socket.prev_partner ){
			if( data.rating == 'delta' && ( ( socket.prev_convo && socket.prev_convo.users[0] && socket.prev_convo.users[1] ) || ( socket.prev_partner.prev_convo && socket.prev_partner.prev_convo.users[0] && socket.prev_partner.prev_convo.users[1] ) ) ){
				if( socket.prev_partner.pio_items ){
					pio.users.createAction( {
						pio_engine: 'engine',
						pio_uid: socket.pio_user,
						pio_iid: socket.prev_partner.pio_items[Math.floor( Math.random() * socket.prev_partner.pio_items.length )],
						pio_action: 'like',
						pio_rate: '5'
					}, function( err, res ){
						if( err ){ console.log( err, res ); }
					});
				}

				if( socket.prev_convo && socket.prev_convo.users[0] ){
					socket.prev_convo.deltas[1] += 1;
					socket.prev_convo.deltas[2] += 1;
					socket.prev_convo.redDeltas.push( socket.prev_convo.users[0] );
					Convo.findByIdAndUpdate( socket.prev_convo._id, { deltas: socket.prev_convo.deltas, redDeltas: socket.prev_convo.redDeltas }, function( err ){ if( err ){ console.log( err ); } } );
				} else if( socket.prev_partner.prev_convo && socket.prev_partner.prev_convo.users[1] ){
					socket.prev_partner.prev_convo.deltas[0] += 1;
					socket.prev_partner.prev_convo.deltas[2] += 1;
					socket.prev_partner.prev_convo.blueDeltas.push( socket.prev_partner.prev_convo.users[1] );
					Convo.findByIdAndUpdate( socket.prev_partner.prev_convo._id, { deltas: socket.prev_partner.prev_convo.deltas, blueDeltas: socket.prev_partner.prev_convo.redDeltas }, function( err ){ if( err ){ console.log( err ); } } );
				}
				
				socket.prev_partner.user.deltas += 1;
				socket.prev_partner.user.save();
			} else if( data.rating == 'same' && socket.prev_partner.pio_items ){
				pio.users.createAction( {
					pio_engine: 'engine',
					pio_uid: socket.pio_user,
					pio_iid: socket.prev_partner.pio_items[Math.floor( Math.random() * socket.prev_partner.pio_items.length )],
					pio_action: 'dislike',
					pio_rate: '1'
				}, function( err, res ){
					if( err ){ console.log( err, res ); }
					socket.prev_partner = null;
				});
			} else if( data.rating == 'flag' ){
				socket.prev_partner.client.flags += 1;
				if( socket.prev_partner.user ){ socket.prev_partner.user.flags += 1; }
				socket.prev_partner = null;
			}
		}
	});
};

//-----------------------------------------------------------------------------
// add user to pool and start attempts to connect to a partner
//-----------------------------------------------------------------------------
chat.virtualConnect = function( socket ){
	//throw the user in the pool
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } );
	socket.inPool = chat.pool.push( socket );
	var recommends = chat.getRecommends( socket.user.pio_user );
	var pickiness = 0.96;
	//periodically scan pool for matches
	socket.retry = setInterval( function(){
		pickiness -= 1.00 - pickiness;
		chat.scanPool( socket, recommends, pickiness );
	}, 1000 );
};

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
chat.virtualDisconnect = function( socket ){		
	clearInterval( socket.retry );
	for( var j=0; j < chat.pool.length; j += 1 ){
		if( chat.pool[j].id == socket.id ){
			chat.pool.splice( j - 1, 1 );
			socket.inPool = null;
		}
	}
	
	if( socket.partner ){
		clearInterval( socket.partner.retry );
		for( var j=0; j < chat.pool.length; j += 1 ){
			if( chat.pool[j].id == socket.partner.id ){
				chat.pool.splice( j - 1, 1 );
				socket.inPool = null;
			}
		}
		if( socket.partner.partner ){
			socket.partner.emit( 'partner disconnected' );
			socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } );
		}

		if( socket.convo ){
			if( socket.convo.users[0] ){
				socket.convo.blueDeltas.push( socket.convo.users[0] );
				Convo.findByIdAndUpdate( socket.convo._id, { blueDeltas: socket.convo.blueDeltas }, function( err ){ if( err ){ console.log( err ); } } );
				socket.partner.emit( 'message', { message: 'You were talking to ' + '<a href="/user/' + socket.convo.users[0] + '">' + socket.convo.users[0] + '</a>.', type: 'server' } );
			}
			if( socket.convo.users[1] ){
				socket.convo.redDeltas.push( socket.convo.users[1] );
				Convo.findByIdAndUpdate( socket.convo._id, { redDeltas: socket.convo.redDeltas }, function( err ){ if( err ){ console.log( err ); } } );
				socket.emit( 'message', { message: 'You were talking to ' + '<a href="/user/' + socket.convo.users[1] + '">' + socket.convo.users[1] + '</a>.', type: 'server' } );
			}
			socket.convo.save();
		}

		if( socket.partner.convo ){
			if( socket.partner.convo.users[0] ){
				socket.partner.convo.blueDeltas.push( socket.partner.convo.users[0] );
				Convo.findByIdAndUpdate( socket.partner.convo._id, { blueDeltas: socket.partner.convo.blueDeltas }, function( err ){ if( err ){ console.log( err ); } } );
			}
			if( socket.partner.convo.users[1] ){
				socket.partner.convo.redDeltas.push( socket.partner.convo.users[1] );
				Convo.findByIdAndUpdate( socket.partner.convo._id, { redDeltas: socket.partner.convo.redDeltas }, function( err ){ if( err ){ console.log( err ); } } );
			}
			socket.partner.convo.save();
		}
		
		if( socket.convo ) socket.prev_convo = socket.convo;
		socket.prev_convoId = socket.convoId;
		socket.prev_partner = socket.partner;
		socket.convo = null;
		socket.convoId = null;
		socket.partner = null;
	}
};

//-----------------------------------------------------------------------------
// try to connect to a partner
//-----------------------------------------------------------------------------
chat.scanPool = function( socket, recommends, pickiness ){
  var partner = chat.findPartner( socket, recommends, pickiness );
	socket.emit( 'message', { message: '...', type: 'debug' } );
	if( partner ){
		chat.handshake( socket, partner );
	}
};

//-----------------------------------------------------------------------------
// scan the pool for a suitable partner
//-----------------------------------------------------------------------------
chat.findPartner = function( socket, recommends, pickiness ){
	var partner, matches;
	if( !socket.partner && socket.inPool && chat.pool.length > 1 ){
		if( recommends && !recommends.message && recommends.length > 0 && pickiness >= 0 && Math.random < 0.9 ){
			var matchNum = Math.floor( ( 1 - pickiness ) * 50 ); //the total number of matches to compare against, as determined by our current pickiness
			if( matchNum < recommends.length ){
				matches = recommends.slice( 0, matchNum );
			} else { matches = recommends; }

			var cannidates = []; //users that are both in the pool and matches
			for( var i=0; i < chat.pool.length; i += 1 ){
				for( var j=0; j < matches.length; j += 1 ){
					for( var k=0; k < chat.pool[i].pio_items.length; k += 1 ){
						if( chat.pool[i].pio_items[k] == matches[j] ){
							cannidates.push( chat.pool[i] );
						}
					}
				}
			}

			if( cannidates.length > 0 ){
				partner = cannidates[Math.floor( Math.random() * cannidates.length ) + 1];
			}
		} else { //if you don't have a suitable list of recommendations, just pick the user which has been waiting the longest
			partner = chat.pool[0];
		}
	}
	return partner;
};

//-----------------------------------------------------------------------------
// get a list of recommended user items for the user based on ratings history
//-----------------------------------------------------------------------------
chat.getRecommends = function( pio_user ){
	pio.items.recommendation( {
		pio_engine: 'engine',
		pio_uid: pio_user,
		pio_n: 50
	}, function( err, recommends ){
		if( err ){ console.log( err ); }
		return recommends;
	});
};

//-----------------------------------------------------------------------------
// once a partner has been found, set up the connection between socket and partner
//-----------------------------------------------------------------------------
chat.handshake = function( socket, partner ){
	if( partner && !partner.partner && partner != socket ){
		socket.partner = partner;
		clearInterval( socket.partner.retry );
		clearInterval( socket.retry );
		
		for( var j=0; j < chat.pool.length; j += 1 ){
			if( chat.pool[j].id == socket.id ){
				chat.pool.splice( j-1, 1 );
				socket.inPool = null;
			} else if( chat.pool[j].id == socket.partner.id ){
				chat.pool.splice( j-1, 1 );
				socket.partner.inPool = null;
			}
		}
    
		socket.partner.partner = socket;
		
		Topic.find().exec( function( err, topics ){
			Topic.count().exec( function( err, count ){
				socket.convo = new Convo( { topic: topics[Math.floor( Math.random() * count )].text } );

				socket.convoId = 0;
				if( socket.partner ){ 
					socket.partner.convoId = 1;		
					socket.emit( 'partner connected' );
					socket.emit( 'message', { message: 'You\'ve found a partner.',               type: 'server' } );
					socket.emit( 'message', { message: socket.convo.topic,                       type: 'server' } );
					socket.partner.emit( 'partner connected' );
					socket.partner.emit( 'message', { message: 'You\'ve found a partner.',       type: 'server' } );
					socket.partner.emit( 'message', { message: socket.convo.topic,               type: 'server' } );
				}
			});
		});
	} else if( !socket.inPool && socket.retry ){
		clearInterval( socket.retry );
	}
};

var giveDelta = function( username, convo_id, color ){
	var failure = false;	

	Convo.findById( convo_id, function( err, convo ){		
		if( color === 'blue' ){
			for( var i=0; i < convo.blueDeltas.length; i+=1 ){
				if( convo.blueDeltas[i] === username ) { 
					failure = true;
					break;
				}
			}
			if( !failure ){
				convo.deltas[0] += 1;
				convo.deltas[2] += 1;
				convo.blueDeltas.push( username );
				Convo.findByIdAndUpdate( convo._id, { deltas: convo.deltas, blueDeltas: convo.blueDeltas }, function(){} );
				User.findOne( { username: convo.users[0] }, function( err, user ){
					if( user ){
						user.deltas += 1;
						User.findByIdAndUpdate( user._id, { deltas: user.deltas }, function(){} );
					}
				});
			}
		} else if( color === 'red' ){
			for( var i=0; i < convo.redDeltas.length; i+=1 ){
				if( convo.redDeltas[i] === username ) { 
					failure = true;
					break;
				}
			}
			if( !failure ){
				convo.deltas[1] += 1;
				convo.deltas[2] += 1;
				convo.redDeltas.push( username );
				Convo.findByIdAndUpdate( convo._id, { deltas: convo.deltas, redDeltas: convo.redDeltas }, function(){} );
				User.findOne( { username: convo.users[1] }, function( err, user ){
					if( user ){
						user.deltas += 1;
						User.findByIdAndUpdate( user._id, { deltas: user.deltas }, function(){} );
					}
				});
			}
		}
	});
}

app.post( '/giveDelta', function( req, res, next ){
	if( req.user && req.user.username && req.body.convo && req.body.color ){
		giveDelta( req.user.username, req.body.convo, req.body.color );
	}
	res.send( null );
});

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//=============================================================================
// AUTHENTICATION PROTOCOL
//=============================================================================
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var createUser = function( body ){
	var newUser = new User( {
		username:  body.username,
		password:  body.password,
		email:     body.email,
		pio_user:  null,
		pio_items: [],
		flags:     0,
		deltas:    0,
		badges:    0,
	});
	newUser.save();

	var pioItemNum = pio.items.index.value;
	pio.users.index.value += 1;

	User.count( {}, function( err, res ){ 
		//create the predictionio user and items associated with the scoket
		pio.users.create( {
			pio_uid: pio.users.index.value,
			pio_inactive: false
		}, function( err, res ){
			if( err ){ console.log( err ); } else {
				newUser.pio_user = pio.users.index.value;
				User.findByIdAndUpdate(  newUser._id,         { pio_user: newUser.pio_user      }, function( err ){ console.log( err ); } );
				Index.findByIdAndUpdate( pio.users.index._id, { value:    pio.users.index.value }, function( err ){ console.log( err ); } );
			}

			for( var i=0; i < pio.ITEMS_PER_USER; i += 1 ){
				pio.items.index.value += 1;
				pio.items.create( {
					pio_iid: pio.items.index.value,
					pio_itypes: 'uitem',
					pio_inactive: false
				}, function( err, res ){
					if( err ){ console.log( err ); } else {
						pioItemNum += 1;
						newUser.pio_items.push( pioItemNum );
						if( newUser.pio_items.length == pio.ITEMS_PER_USER ){
							User.findByIdAndUpdate( newUser._id,          { pio_items: newUser.pio_items     }, function( err ){ console.log( err ); } );
							Index.findByIdAndUpdate( pio.items.index._id, { value:     pio.items.index.value }, function( err ){ console.log( err ); } );
						}
					}
				});
			}
		});
	});
  
	return newUser;
};

app.get( '/login', function( req, res, next ){
	passport.authenticate( 'local', function( err, user, info ){
		if( info && info.message == 'bad name' ){
			res.send( 'bad name' );
		} else if( info && info.message == 'bad pass' ){
			res.send( 'bad pass' );
		} else if( user ){
			req.logIn( user, function( err ){ 
				if( err ){
					console.log( 'login error: ' + err );
					res.send( err ); 
				} else {
					res.send( user );
				}
			});
		} else {
			res.send( 'login error' );
			console.log( 'login error: ' + err );
		}
	})( req, res, next );
});

app.post( '/register', function( req, res, next ){
	//does the username exist already?
	User.findOne( { username: req.body.username }, function( err, user ){
		if( err ){
			console.log( 'registration error: ' + err );
			return res.send( err );
		} else if( user ){
			return res.send( 'bad name' );
		} else {
			//does the email exist already?
			User.findOne( { email: req.body.email }, function( err, user ){
				if( err ){
					console.log( 'registration error: ' + err );
					return res.send( err );
				} else if( req.body.email && user ){
					return res.send( 'bad email' );
				} else {
					console.log( createUser( req.body ) );
          req.login( createUser( req.body ), function( err ){
            if( err ){ console.log( err ); } 
          });
					return res.send( 'success' );
				}
			});
		}
	});
});

app.post( '/changePass', function( req, res, next ){
	req.user.comparePassword( req.body.old, req.user.password, function( err, isMatch ){
		if( err ){
			console.log( 'error: ' + err );
			res.send( 'bad pass' );
		} else if( !isMatch ){
			res.send( 'bad pass' );
		} else {
			req.user.password = req.body.new;
			req.user.save();
			return res.send( 'success' );
		}
	});
});

app.post( '/changeEmail', function( req, res, next ){
	req.user.comparePassword( req.body.pass, req.user.password, function( err, isMatch ){
		if( err ){
			console.log( 'error: ' + err );
			res.send( 'bad pass' );
		} else if( !isMatch ){
			res.send( 'bad pass' );
		} else {
			req.user.email = req.body.new;
			req.user.save();
			return res.send( 'success' );
		}
	});
});

app.get( '/isLogged', function( req, res, next ){
	if( req.user ){
		return res.send( req.user );
	} else {
		return res.send( false );
	}
});

app.get( '/logout', function( req, res, next ){
	req.logout();
	res.redirect( '/' );
});

///////////////////////////////////////////////////////////////////////////////
// Mongo queries
///////////////////////////////////////////////////////////////////////////////
app.get( '/mongo/profile/convos/list', function( req, res, next ){
	var pageNumber = req.query.pageNum * req.query.pageSize;
	if( req.query.sort == 'most deltas' ){
		Convo.find( { users: { $in: [req.query.username] } } )
			.sort( { deltas: -1 } )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	} else if( req.query.sort == 'length' ){
		Convo.find( { users: { $in: [req.query.username] } } )
			.sort( '-size' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	} else {
		Convo.find( { users: { $in: [req.query.username] } } )
			.sort( '-date' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	}
});

app.get( '/mongo/profile/mail/list', function( req, res, next ){
	var pageNumber = req.query.pageNum * req.query.pageSize;
	
	if( req.query.sort == 'most messages' ){
		Mail.find( { from: req.user.username } ).sort( '-messageNum' ).skip( pageNumber ).limit( req.query.pageSize ).exec( function( err, mail ){
			res.send( mail );
		});
	} else {
		Mail.find( { from: req.user.username } ).sort( '-date' ).skip( pageNumber ).limit( req.query.pageSize ).exec( function( err, mail ){
			res.send( mail );
		});
	}
});

app.get( '/mongo/profile/mail/convo', function( req, res, next ){
	Mail.findOne( { to: req.query.from, from: req.user.username }, function( err, mail ){
		if( !mail ){ 
			var newMail = new Mail( {
				to: req.query.from,
				from: req.user.username
			});
			newMail.save();
			var newMail2 = new Mail( {
				to: req.user.username,
				from: req.query.from
			});
			newMail2.save();
			res.send( newMail );
		} else {
			res.send( mail );
		}
	});
});

app.get( '/mongo/profile/mail/access', function( req, res, next ){
	Mail.findOne( { to: req.query.to, from: req.user.username }, function( err, mail ){
		if( mail ){
			mail.dateAccessed = Date.now();
			mail.newMessages = 0;
			mail.save();
		}
	});
});

app.get( '/mongo/profile/badges/list', function( req, res, next ){
	Badge.find( { "owners.username": req.query.username } ).sort( 'ownerNum' ).exec( function( err, badges ){
		//do client-side sorting for everything except for sort by rarity (ownerNum): hacky solution because I don't understand aggregation
		res.send( badges );
	});
});

app.get( '/mongo/scoreboard/users/list', function( req, res, next ){
	var pageNumber = req.query.pageNum * req.query.pageSize;
	if( req.query.sort == 'most deltas' ){
		User.find()
			.sort( '-deltas' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, users ){
			if( users !== '' ){ 
				res.send( users );
			} else {
				res.send( null );
			}
		});
	} else if( req.query.sort == 'most badges' ){
		User.find()
			.sort( '-badges' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, users ){
			if( users !== '' ){ 
				res.send( users );
			} else {
				res.send( null );
			}
		});
	} else {
		User.find()
			.sort( '-date' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, users ){
			if( users !== '' ){ 
				res.send( users );
			} else {
				res.send( null );
			}
		});
	}
});


app.get( '/mongo/scoreboard/convos/list', function( req, res, next ){
	var pageNumber = req.query.pageNum * req.query.pageSize;
	if( req.query.sort == 'most deltas' ){
		Convo.find()
			.sort( { deltas: -1 } )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	} else if( req.query.sort == 'length' ){
		Convo.find()
			.sort( '-size' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	} else {
		Convo.find()
			.sort( '-date' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ){
			if( convos !== '' ){ 
				res.send( convos );
			} else {
				res.send( null );
			}
		});
	}
});

app.get( '/mongo/scoreboard/badges/list', function( req, res, next ){
	Badge.find().sort( 'ownerNum' ).exec( function( err, badges ){
		//do client-side sorting for everything except for sort by rarity (ownerNum): hacky solution because I don't understand aggregation
		res.send( badges );
	});
});

app.get( '/mongo/dock/mailCount', function( req, res, next ){
	var newMessageCount = 0;
	Mail.find( { from: req.user.username } ).exec( function( err, mail ){
		if( mail ){
			for( var i=0; i < mail.length; i+=1 ){
				newMessageCount += mail[i].newMessages;
			}
			res.send( '' + newMessageCount + '' );
		}
	});
});
