//=============================================================================
// SERVER START UP
//=============================================================================
var config       = require( './config.js' );
var express      = require( 'express' );
var bodyParser   = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
var session      = require( 'express-sessions' );
var stylus       = require( 'stylus' );
var passport     = require( 'passport' );
var passportSIO  = require( 'passport.socketio' );
var sessionStore = require( 'sessionstore' );
var passConfig   = require( './server/passConfig.js' )( passport );
var db           = require( './server/schemas/mainDB.js' );
var speakeasy    = require( 'speakeasy-nlp' );
var pio          = require( 'predictionio' ) ( {
	key: config.PIO_API_KEY,
	baseUrl: config.PIO_API_HOST
})

pio.ITEMS_PER_USER = 5;
new Index( { name: 'pio_users' } ).save( function() {
	new Index( { name: 'pio_items' } ).save( function() {
		Index.findOne( { name: 'pio_users' }, function( err, index ) { console.log( err ); pio.users.index = index; console.log( pio.users.index ); } );
		Index.findOne( { name: 'pio_items' }, function( err, index ) { console.log( err ); pio.items.index = index; console.log( pio.items.index ); } );
	});
});

//use the express app engine
var app = express();
app.use( bodyParser() );
app.use( cookieParser() );
app.use( session( { 
	key: '435.sid',
	secret: config.COOKIE_SECRET,
	store: sessionStore.mongo
}));
sessionStore.mongo = sessionStore.createSessionStore( {
	type:     'mongoDb',
	username: config.MONGO_USER,
	password: config.MONGO_PASS,
	host:     config.MONGO_IP,
	port:     config.MONGO_PORT,
	dbName:   config.MONGO_DB_NAME,
	collectionName: 'sessions'
});

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
app.get( '/',                    function( req, res ) { res.render( 'chat/chat'                     ); } );
app.get( '/user',                function( req, res ) { res.render( 'profile/profile'               ); } );
app.get( '/profile/delta',       function( req, res ) { res.render( 'profile/delta/delta'           ); } );
app.get( '/profile/badges',      function( req, res ) { res.render( 'profile/badges/badges'         ); } );
app.get( '/profile/badges/view', function( req, res ) { res.render( 'profile/badges/view/view'      ); } );
app.get( '/profile/options',     function( req, res ) { res.render( 'profile/options/options'       ); } );
app.get( '/profile/mail',        function( req, res ) { res.render( 'profile/mail/mail'             ); } );

app.get( '/modules/ratings',     function( req, res ) { res.render( 'modules/ratings/ratings'       ); } );
app.get( '/modules/dock/auth',   function( req, res ) { res.render( 'modules/dock/dock_in'          ); } );
app.get( '/modules/dock',        function( req, res ) { res.render( 'modules/dock/dock_out'         ); } );
app.get( '/modules/login',       function( req, res ) { res.render( 'modules/login/login'           ); } );
app.get( '/modules/convo',       function( req, res ) { res.render( 'modules/convo/convo'           ); } );
app.get( '/modules/convols',     function( req, res ) { res.render( 'modules/convols/convols'       ); } );
app.get( '/modules/mail_ls',     function( req, res ) { res.render( 'modules/mail_ls/mail_ls'       ); } );
app.get( '/modules/mail_convo',  function( req, res ) { res.render( 'modules/mail_convo/mail_convo' ); } );
app.get( '/modules/mail_input',  function( req, res ) { res.render( 'modules/mail_input/mail_input' ); } );


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
var chat = new Object()
var mail = new Object()
chat.pool = [] //pool of unpaired users

//-----------------------------------------------------------------------------
// what to do when the socket connects
// this also bootstraps the rest of the protocol
//-----------------------------------------------------------------------------
io.of( '/main' ).on( 'connection', function( socket ) { chat.connect( socket ) } )
io.of( '/mail' ).on( 'connection', function( socket, partner ) { mail.connect( socket ) } )

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
mail.connect = function( socket ) {
	socket.user = socket.handshake.user;

	socket.on( 'partner', function( name ) {
		User.findOne( { username: name }, function( err, user ) {
			socket.partner = user;
			socket.room = socket.user.username + '@' + socket.partner.username;
			socket.join( socket.room ); //the socket joins a room identified by the combination of its username and its partners name
		});
	});

	socket.on( 'disconnect', function() {
		socket.leave( socket.room );
		socket.partner = null;
		socket.room = null;
		socket = null;
	})

	socket.on( 'virtual disconnect', function() {
		socket.leave( socket.room );
		socket.partner = null;
		socket.room = null;
	})

	//when server recieves 'send' relay 'message' to client 'send' is a mail message coming from a client, and 'message' is a mail message being sent from the server to a client.
	socket.on( 'send', function( data ) {
		if( socket.partner ) {
			data.type = 'partner';
			data.to = socket.user.username;
			socket.broadcast.to( socket.partner.username + '@' + socket.user.username ).emit( 'message', data );
			Mail.findOne( { to: socket.partner.username, from: socket.user.username }, function( err, mail ) {
				if( !mail ) {
					mail = new Mail( {
						to: socket.partner.username,
						from: socket.user.username
					});
				};
				mail.messages.push( {
					userId: 0,
					message: data.message
				});
				mail.save();
			});
			Mail.findOne( { to: socket.user.username, from: socket.partner.username }, function( err, mail ) {
				if( !mail ) {
					mail = new Mail( {
						to: socket.user.username,
						from: socket.partner.username
					});
				};
				mail.messages.push( {
					userId: 1,
					message: data.message
				});
				mail.new++;
				mail.save();
			});
		};		
	});

	socket.on( 'clear new', function( to ) {
		Mail.findOne( { to: to, from: socket.user.username }, function( err, mail ) {
			if( mail ) {
				mail.date_accessed = Date.now();
				mail.new = 0;
				mail.save();
			}
		})
	})
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
chat.connect = function( socket ) {
	socket.user = socket.handshake.user
	Client.findOne( { ip: socket.handshake.address.address }, function( err, res ) { socket.client = res } )

	if( !socket.client ) {
		socket.client = new Client( {
			ip: socket.handshake.address.address,
			flags: 0
		}) 
		socket.client.save()
	}

	chat.virtualConnect( socket )
	socket.on( 'virtual connection', function() { chat.virtualConnect( socket )    } )
	socket.on( 'disconnect',         function() { chat.virtualDisconnect( socket ) } ) //user disconnects through leaving the page: full disconnect
	socket.on( 'virtual disconnect', function() { chat.virtualDisconnect( socket ) } ) //user disconnects through hitting the disconnect button: virtual disconnect
		
	socket.on( 'send', function( data ) {        	//when server recieves 'send' relay 'message' to client
		data.type = 'partner'                       	//'send' is a chat message coming from a client, and
		if( socket.partner ) {                       //'message' is a chat message being sent from the server to a client.
			socket.partner.emit( 'message', data );
			console.log( 'message sentiment: ', speakeasy.sentiment.analyze( data.message ) );
			if( socket.convo ) {
				socket.convo.users[0] = socket.user.username; 
				socket.convo.messages.push( {
					userId: 0,
					message: data.message,
				});
				socket.convo.size++;
			} else if( socket.partner.convo ) {
				socket.partner.convo.users[1] = socket.user.username;
				socket.partner.convo.messages.push( {
					userId: 1,
					message: data.message,
				});
				socket.partner.convo.size++;
			};
		};
	});

	//what to do when the user provides a rating
	socket.on( 'rate', function( data ) {
		if( socket.prev_partner ) {
			if( data.rating == 'delta' && ( ( socket.prev_convo && socket.prev_convo.users[0] && socket.prev_convo.users[1] ) || ( socket.prev_partner.prev_convo && socket.prev_partner.prev_convo.users[0] && socket.prev_partner.prev_convo.users[1] ) ) ) {
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
					Convo.findByIdAndUpdate( socket.prev_convo._id, { deltas: socket.prev_convo.deltas }, function( err ) { console.log( err ) } );
				} else if( socket.prev_partner.prev_convo ) {
					socket.prev_partner.prev_convo.deltas[0]++;
					socket.prev_partner.prev_convo.deltas[2]++;
					Convo.findByIdAndUpdate( socket.prev_partner.prev_convo._id, { deltas: socket.prev_partner.prev_convo.deltas }, function( err ) { console.log( err ) } );
				}
				
				socket.prev_partner.user.deltas++;
				socket.prev_partner.user.save();
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
chat.virtualConnect = function( socket ) {
	//throw the user in the pool
	socket.emit( 'message', { message: 'Looking for a partner...', type: 'server' } )
	socket.inPool = chat.pool.push( socket )
	var recommends = chat.getRecommends( socket.user.pio_user )
	var pickiness = 0.96
	//periodically scan pool for matches
	socket.retry = setInterval( function() {
		pickiness -= 1.00 - pickiness
		chat.scanPool( socket, recommends, pickiness )
	}, 1000 )
}

//-----------------------------------------------------------------------------
// create our socket and connect to the server
//-----------------------------------------------------------------------------
chat.virtualDisconnect = function( socket ) {		
	clearInterval( socket.retry )
	for( var j=0; j < chat.pool.length; j++ ) {
		if( chat.pool[j].id == socket.id ) {
			chat.pool.splice( j - 1, 1 )
			socket.inPool = null
		}
	}
	
	if( socket.partner ) {
		clearInterval( socket.partner.retry )

		for( var j=0; j < chat.pool.length; j++ ) {
			if( chat.pool[j].id == socket.partner.id ) {
				chat.pool.splice( j - 1, 1 )
				socket.inPool = null
			}
		}
		if( socket.partner.partner ) {
			socket.partner.emit( 'partner disconnected' );
			socket.partner.emit( 'message', { message: 'Your partner has disconnected.', type: 'server' } );
		}

		if( socket.convo ) {
			if( socket.convo.users[1] ) socket.emit( 'message', { message:
				'You were talking to ' + '<a href="/user/' + socket.convo.users[1] + '">' + socket.convo.users[1] + '</a>.',
			type: 'server' } );
			console.log( socket.convo );
			socket.convo.save();
		};

		if( socket.partner.convo ) {
			if( socket.partner.convo.users[0] ) socket.emit( 'message', { message: 
				'You were talking to ' + '<a href="/user/' + socket.partner.convo.users[0] + '">' + socket.partner.convo.users[0] + '</a>' + '.',
			type: 'server' } );
			console.log( socket.convo );
			socket.partner.convo.save();
		};
		
		if( socket.convo ) socket.prev_convo = socket.convo;
		socket.prev_convoId = socket.convoId;
		socket.prev_partner = socket.partner;
		socket.convo = null;
		socket.convoId = null;
		socket.partner = null;
	};
};

//-----------------------------------------------------------------------------
// try to connect to a partner
//-----------------------------------------------------------------------------
chat.scanPool = function( socket, recommends, pickiness ) {
	socket.emit( 'message', { message: '...', type: 'debug' } )
	if( partner = chat.findPartner( socket, recommends, pickiness ) ) { //set partner equal to chat.findPartner() and then check if partner exists
		chat.handshake( socket, partner );
	};
};

//-----------------------------------------------------------------------------
// scan the pool for a suitable partner
//-----------------------------------------------------------------------------
chat.findPartner = function( socket, recommends, pickiness ) {
	if( !socket.partner && socket.inPool && chat.pool.length > 1 ) {
		var partner;

		if( recommends && !recommends.message && recommends.length > 0 && pickiness >= 0 && Math.random < 0.9 ) {
			var matchNum = Math.floor( ( 1 - pickiness ) * 50 ); //the total number of matches to compare against, as determined by our current pickiness
			if( matchNum < recommends.length ) {
				var matches = recommends.slice( 0, matchNum );
			} else { var matches = recommends }

			var cannidates = [] //users that are both in the pool and matches
			for( var i=0; i < chat.pool.length; i++ ) {
				for( var j=0; j < matches.length; j++ ) {
					for( var k=0; k < chat.pool[i].pio_items.length; k++ ) {
						if( chat.pool[i].pio_items[k] == matches[j] ) {
							cannidates.push( chat.pool[i] );
						};
					};
				};
			};

			if( cannidates.length > 0 ) {
				partner = cannidates[Math.floor( Math.random() * cannidates.length ) + 1];
			};
		} else { //if you don't have a suitable list of recommendations, just pick the user which has been waiting the longest
			partner = chat.pool[0]
		}
	}

	return partner
}

//-----------------------------------------------------------------------------
// get a list of recommended user items for the user based on ratings history
//-----------------------------------------------------------------------------
chat.getRecommends = function( pio_user ) {
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
chat.handshake = function( socket, partner ) {
	if( partner && !partner.partner && partner != socket ) {
		socket.partner = partner
		clearInterval( socket.partner.retry )
		clearInterval( socket.retry )
		
		for( var j=0; j < chat.pool.length; j++ ) {
			if( chat.pool[j].id == socket.id ) {
				chat.pool.splice( j-1, 1 )
				socket.inPool = null
			} else if( chat.pool[j].id == socket.partner.id ) {
				chat.pool.splice( j-1, 1 )
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
	newUser.save();

	var pioItemNum = pio.items.index.value;
	pio.users.index.value++;

	User.count( {}, function( err, res ) { 
		//create the predictionio user and items associated with the scoket
		pio.users.create( {
			pio_uid: pio.users.index.value,
			pio_inactive: false
		}, function( err, res ) {
			if( err ) { console.log( err ); } else {
				newUser.pio_user = pio.users.index.value;
				User.findByIdAndUpdate(  newUser._id,         { pio_user: newUser.pio_user      }, function( err ) { console.log( err ) } );
				Index.findByIdAndUpdate( pio.users.index._id, { value:    pio.users.index.value }, function( err ) { console.log( err ) } );
			}

			for( var i=0; i < pio.ITEMS_PER_USER; i++ ) {
				pio.items.index.value++;
				pio.items.create( {
					pio_iid: pio.items.index.value,
					pio_itypes: 'uitem',
					pio_inactive: false
				}, function( err, res ) {
					if( err ) { console.log( err ); } else {
						pioItemNum++;
						newUser.pio_items.push( pioItemNum );
						if( newUser.pio_items.length == pio.ITEMS_PER_USER ) {
							User.findByIdAndUpdate( newUser._id,          { pio_items: newUser.pio_items     }, function( err ) { console.log( err ) } );
							Index.findByIdAndUpdate( pio.items.index._id, { value:     pio.items.index.value }, function( err ) { console.log( err ) } );
						}
					}
				})
			}
		})
	})

	return newUser;
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
					console.log( createUser( req.body ) );
					req.login( createUser( req.body ), function(err) { if( err ) console.log( err ) } );
					return res.send( 'success' )
				}					
			})
		}
	})
})

app.post( '/changePass', function( req, res, next ) {
	req.user.comparePassword( req.body.old, req.user.password, function( err, isMatch ) {
		if( err ) {
			console.log( 'error: ' + err );
			res.send( 'bad pass' );
		} else if( !isMatch ) {
			res.send( 'bad pass' );
		} else {
			req.user.password = req.body.new;
			req.user.save();
			return res.send( 'success' );
		}						 	
	});
});

app.post( '/changeEmail', function( req, res, next ) {
	req.user.comparePassword( req.body.pass, req.user.password, function( err, isMatch ) {
		if( err ) {
			console.log( 'error: ' + err );
			res.send( 'bad pass' );
		} else if( !isMatch ) {
			res.send( 'bad pass' );
		} else {
			req.user.email = req.body.new;
			req.user.save();
			return res.send( 'success' );
		}						 	
	});
});



app.get( '/isLogged', function( req, res, next ) {
	if( req.user ) {
		return res.send( req.user )
	} else {
		return res.send( false )
	}
})

app.get( '/logout', function( req, res, next ) {
	req.logout();
	res.redirect( '/' );
})

///////////////////////////////////////////////////////////////////////////////
// Mongo queries
///////////////////////////////////////////////////////////////////////////////
app.get( '/mongo/profile/delta/list', function( req, res, next ) {
	var pageNumber = req.query.pageNum * req.query.pageSize;
	if( req.query.sort == 'most deltas' ) {
		Convo.find( { users: { $in: [req.query.name] } } )
			.sort( { deltas: -1 } )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ) { 
			res.send( convos ); 
		});
	} else if( req.query.sort == 'length' ) {
		Convo.find( { users: { $in: [req.query.name] } } )
			.sort( '-size' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ) { 
			res.send( convos ); 
		});
	} else {
		Convo.find( { users: { $in: [req.query.name] } } )
			.sort( '-date' )
			.skip( pageNumber )
			.limit( req.query.pageSize )
		.exec( function( err, convos ) { 
			res.send( convos ); 
		});
	}
});

app.get( '/mongo/profile/mail/list', function( req, res, next ) {
	var pageNumber = req.query.pageNum * req.query.pageSize;
	Mail.find( { from: req.user.username } ).sort( '-date' ).skip( pageNumber ).limit( req.query.pageSize ).exec( function( err, mail ) {
		res.send( mail );
	});
});

app.get( '/mongo/profile/mail/convo', function( req, res, next ) {
	Mail.findOne( { to: req.query.from, from: req.user.username }, function( err, mail ) {
		if( !mail ) { 
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
		};
	});
});

app.get( '/mongo/profile/mail/access', function( req, res, next ) {
	Mail.findOne( { to: req.query.to, from: req.user.username }, function( err, mail ) {
		console.log( 'username ' + req.user.username );
		console.log( 'to ' + req.query.to );
		if( mail ) {
			console.log( 'success!' );
			mail.date_accessed = Date.now();
			mail.new = 0;
			mail.save();
		}
	})
})
