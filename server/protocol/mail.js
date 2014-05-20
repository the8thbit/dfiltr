module.exports = function( app ){
	var mail = {};

	//-----------------------------------------------------------------------------
	// what to do when the socket connects
	// this also bootstraps the rest of the protocol
	//-----------------------------------------------------------------------------
	app.protocol.of( '/mail' ).on( 'connection', function( socket, partner ){ mail.connect( socket ); } );

	//-----------------------------------------------------------------------------
	// create our socket and connect to the server
	//-----------------------------------------------------------------------------
	mail.connect = function( socket ){
		socket.user = socket.handshake.user;

		socket.on( 'partner', function( name ){
			User.findOne( { username: name }, function( err, user ){
				if( user ){
					socket.partner = user;
					socket.room = socket.user.username + '@' + socket.partner.username;
					socket.join( socket.room ); //the socket joins a room identified by the combination of its username and its partners name
				}
				app.handleErr( err );
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
				Mail.findOne( { to: socket.user.username, from: socket.partner.username }, function( err, convo ){
					if( !convo ){
						convo = new Mail( {
							to: socket.user.username,
							from: socket.partner.username
						});
					}
					convo.messages.push( {
						userId: 1,
						message: data.message
					});
					convo.messageNum += 1;
					convo.newMessages += 1;
					convo.save();
					app.handleErr( err );
				});
			}
		});

		socket.on( 'clear new', function( to ){
			Mail.findOne( { to: to, from: socket.user.username }, function( err, mail ){
				if( mail ){
					mail.dateAccessed = Date.now();
					mail.newMessages = 0;
					mail.save();
					Convo.findByIdAndUpdate( mail._id, { newMessages: 0 }, app.handleErr );
				}
				app.handleErr( err );
			});
		});
	};

	return mail;
}
