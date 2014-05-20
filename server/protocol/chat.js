module.exports = function( app ){
	var chat = {};
	chat.pool = []; //pool of unpaired users

	//-----------------------------------------------------------------------------
	// what to do when the socket connects
	// this also bootstraps the rest of the protocol
	//-----------------------------------------------------------------------------
	app.protocol.of( '/main' ).on( 'connection', function( socket ){ chat.connect( socket ); } );

	//-----------------------------------------------------------------------------
	// create our socket and connect to the server
	//-----------------------------------------------------------------------------
	chat.connect = function( socket ){
		socket.user = socket.handshake.user;
		Client.findOne( { ip: socket.handshake.address.address }, function( err, res ){ 
			socket.client = res;
			app.handleErr( err );
		});

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
						}, app.handleErr );
					}

					if( socket.prev_convo && socket.prev_convo.users[0] ){
						socket.prev_convo.deltas[1] += 1;
						socket.prev_convo.deltas[2] += 1;
						console.log( 'red: ' + socket.prev_convo.users[0] );
						socket.prev_convo.redDeltas.push( socket.prev_convo.users[0] );
						Convo.findByIdAndUpdate( socket.prev_convo._id, { deltas: socket.prev_convo.deltas, redDeltas: socket.prev_convo.redDeltas }, function( err ){ if( err ){ console.log( err ); } } );
					} else if( socket.prev_partner.prev_convo && socket.prev_partner.prev_convo.users[1] ){
						socket.prev_partner.prev_convo.deltas[0] += 1;
						socket.prev_partner.prev_convo.deltas[2] += 1;
						console.log( 'blue: ' + socket.prev_partner.prev_convo.users[1] );
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
					Convo.findByIdAndUpdate( socket.convo._id, { blueDeltas: socket.convo.blueDeltas }, app.handleErr );
					socket.partner.emit( 'message', { message: 'You were talking to ' + '<a href="/user/' + socket.convo.users[0] + '">' + socket.convo.users[0] + '</a>.', type: 'server' } );
				}
				if( socket.convo.users[1] ){
					socket.convo.redDeltas.push( socket.convo.users[1] );
					Convo.findByIdAndUpdate( socket.convo._id, { redDeltas: socket.convo.redDeltas }, app.handleErr );
					socket.emit( 'message', { message: 'You were talking to ' + '<a href="/user/' + socket.convo.users[1] + '">' + socket.convo.users[1] + '</a>.', type: 'server' } );
				}
				socket.convo.save();
			}

			if( socket.partner.convo ){
				if( socket.partner.convo.users[0] ){
					socket.partner.convo.blueDeltas.push( socket.partner.convo.users[0] );
					Convo.findByIdAndUpdate( socket.partner.convo._id, { blueDeltas: socket.partner.convo.blueDeltas }, app.handleErr );
				}
				if( socket.partner.convo.users[1] ){
					socket.partner.convo.redDeltas.push( socket.partner.convo.users[1] );
					Convo.findByIdAndUpdate( socket.partner.convo._id, { redDeltas: socket.partner.convo.redDeltas }, app.handleErr );
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
		app.pio.items.recommendation( {
			pio_engine: 'engine',
			pio_uid: pio_user,
			pio_n: 50
		}, function( err, recommends ){
			app.handleErr( err );
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

	return chat;
}
