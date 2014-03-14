var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../../config.js"><\/script>' );

window.onload = function() {
	var chat      = $( '#chat-wrapper' );
	chat.socket   = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/main' );

	chat.sim = [];
	chat.messages = []; //the list of all messages to the user
	chat.margin   = chat.css( 'margin-left' )[0];

	chat.dock                = $( '#chat-dock' );                //the place where the user dock goes
	chat.output              = $( '#chat-output' );              //the place where conversations go
	chat.output.wrap         = $( '#chat-output-wrapper' );      //the wrapper for above
	chat.input               = $( '#chat-input' );               //the lower panel, where the user can type and send messages
	chat.input.field         = $( '#chat-input-field' );         //the textarea that the user can type into and send messages from
	chat.input.field.wrap    = $( '#chat-input-field-wrapper' ); //the wrapper for the aforementioned textarea
	chat.input.button        = $( '.chat-input-button' );        //a class consisting of the buttons on the input panel
	chat.input.sendButton    = $( '#chat-input-send' );          //the button used to send messages
	chat.input.connectButton = $( '#chat-input-connect' );       //the button used to connect/disconnect from a discussion

	chat.input.connectButton.data( 'state', 'DISCONNECT' );      //adds states to the connect/disconnect button to swap between the two
	chat.input.sendButton.data( 'state', 'DISABLED' );           //adds states to the send button to show when you can't send messages
	
	//===============================================
	// Internal Functions
	//===============================================
	//adds a new line to the output field
	chat.output.add = function( data ) {
		if( data && data.message && data.message != '' && data.type ) {
			if( data.type == 'server'  ) { var text = '<span class="chat-message-server">'  + data.message + '</span>'; } else
			if( data.type == 'partner' ) { var text = '<span class="chat-message-partner">' + data.message + '</span>'; } else
			if( data.type == 'self'    ) { var text = '<span class="chat-message-self">'    + data.message + '</span>'; } else
			if( data.type == 'debug'   ) { var text = '<span class="chat-message-debug">'   + data.message + '</span>'; }
			if( text ) { chat.messages.push( text ); }
			var html = '';
			for( var i=0; i < chat.messages.length; i++ ) {
				html += chat.messages[i] + '<br />';
			}
			chat.output.html( html );
			chat.output.scrollTop( 99999999 );
		}
	};
	//sends a message to the partner
	chat.input.send = function( text ) {
		if( text != '' ) {
			chat.input.field.prop( 'value', '' );
			chat.socket.emit( 'send', { message: text } );
		}
	};
	//clears the output field
	chat.output.clear = function() {
		chat.messages = [];
		this.html( '' );
		this.scrollTop( 99999999 );
	};
	//this function will either create a new virtual connection, or end the current virtual connection
	//depending upon the state of chat.input.connectButton
	chat.input.connectButton.toggle = function() {
		if( chat.input.connectButton.data( 'state' ) == 'DISCONNECT' ) {
			if( chat.socket.connected ) {
				chat.input.field.wrap.load( '/modules/ratings', function() { ratings.init(); } );
				chat.input.sendButton.toggle();
			}
			chat.socket.connected = false;
			chat.socket.emit( 'virtual disconnect' );
			chat.output.add( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
			chat.input.field.wrap.css( 'background-color', '#eeeeee' );
			chat.input.field.prop( 'readOnly', true );
			chat.input.field.prop( 'value', '' );
			chat.input.field.css( 'visibility', 'hidden' );
			chat.input.connectButton.prop( 'value', 'new discussion' );
			chat.input.connectButton.data( 'state', 'NEW' );
		} else if( chat.input.connectButton.data( 'state' ) == 'NEW' ) {
			chat.output.clear();
			chat.input.connectButton.prop( 'value', 'disconnect' );
			chat.input.connectButton.data( 'state', 'DISCONNECT' );
			chat.input.field.wrap.html( chat.input.field ); //puts the input field back in its wrapper
			chat.socket.emit( 'virtual connection' );
		}
	};
	chat.input.sendButton.toggle = function() {
		if( chat.input.sendButton.data( 'state' ) == 'DISABLED' ) {
			chat.input.sendButton.data( 'state', 'ENABLED' );
			chat.input.sendButton.css( 'background-color', '#0B5FA5' );
		} else {
			chat.input.sendButton.data( 'state', 'DISABLED' );
			chat.input.sendButton.css( 'background-color', '#999' );
		}
	};
	chat.resize = function()  {
		chat.output.wrap.css( { 'height': 
			$( window ).height() - ( 
				chat.input.field.wrap.outerHeight() + 
				chat.dock.outerHeight() +
				chat.margin * 3
			)
		});
		chat.input.field.wrap.css( { 'width': 
			$( window ).width() - ( 
				chat.input.connectButton.outerWidth() + 
				chat.input.sendButton.outerWidth() + 
				chat.margin * 4
			) 
		});
	};

	chat.createSim = function() {
		for( var i=0; i < 100; i++ ) {
			chat.sim[i] = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/sim/' + i );
			if( chat.sim[i] ) {
				chat.sim[i].num = i;

				chat.sim[i].on( 'partner connected', function() {
					var thisSim = this;
					var timeout = Math.floor((Math.random()*100000)+10);
					
					thisSim.emit( 'send', { message: 
						'I am Sim number ' + thisSim.num + '. ' + 
						'I will disconnect in ' + timeout + ' ms.'
					});
					setTimeout( 
						function() { 
							thisSim.emit( 'virtual disconnect' )
							setTimeout(
								function() { 
									thisSim.emit( 'virtual connection' )
								}, ( Math.random() * 10000 ) + 10
							)
					 	}, timeout
					);
				});
	
				chat.sim[i].on( 'partner disconnected', function() {
					var thisSim = this;
					var timeout = Math.floor((Math.random()*5000)+10);
					setTimeout( 
						function() { thisSim.emit( 'virtual connect' ); },
						timeout
					)
				});
			}
		}
	};

	//==========================================================================
	// UI interactions
	//==========================================================================
	chat.input.connectButton.hover(
		function() {
			$( this ).fadeTo( 'fast' , 1.0 );
		}, function() {
			$( this ).fadeTo( 'fast' , 0.7 );
		}
	);
	chat.input.sendButton.hover( 
		function() {
			if( chat.input.sendButton.data( 'state' ) == 'ENABLED' ) {
				$( this ).fadeTo( 'fast' , 1.0 );
			}
		}, function() {
			$( this ).fadeTo( 'fast' , 0.7 );
		}
	);

	$( document ).keydown( function( e ){
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			chat.output.add( { message: chat.input.field.prop( 'value' ), type:'self' } );
			chat.input.send( chat.input.field.prop( 'value' ) );
		}
	});
	$( document ).keyup( function( e ){
		//ESC KEY: end discussion/start new discussion
		if( e.keyCode == 27 ) {
			e.preventDefault();
			chat.input.connectButton.toggle();
		}

		if( e.keyCode == 17 ) {
			e.preventDefault();
			chat.createSim();
		}

	});

	chat.input.sendButton.on( 'click', function() {
		chat.output.add( { message: chat.input.field.prop( 'value' ), type:'self' } );
		chat.input.send( chat.input.field.prop( 'value' ) );
	});
	chat.input.connectButton.on( 'click', function() {
		chat.input.connectButton.toggle();
	});

	//===============================================
	// Chat Protocol
	//===============================================
	//what to do when the user recieves a message
	chat.socket.on( 'message', function( data ) {
		chat.output.add( data );
	});

	//what to do when the user finds a chat partner
	chat.socket.on( 'partner connected', function() {
		chat.socket.connected = true;
		chat.output.prop( 'value', '' );
		chat.input.field.wrap.html( chat.input.field ); //puts the input field back in its wrapper
		chat.input.field.wrap.css( 'background-color', 'white' );
		chat.input.field.prop( 'readOnly', false );
		chat.input.field.css( 'visibility', 'visible' );
		chat.input.field.focus();
		chat.input.sendButton.toggle();
	});

	//what to do when a chat partner disconnects
	chat.socket.on( 'partner disconnected', function() {
		chat.socket.connected = false;
		chat.input.field.wrap.load( '/modules/ratings', function() { ratings.init(); } );
		chat.socket.emit( 'virtual disconnect' );
		chat.input.field.wrap.css( 'background-color', '#eeeeee' );
		chat.input.field.prop( 'readOnly', true );
		chat.input.field.prop( 'value', '' );
		chat.input.field.css( 'visibility', 'hidden' );
		chat.input.connectButton.prop( 'value', 'new discussion' );
		chat.input.connectButton.data( 'state', 'NEW' );
		chat.input.sendButton.toggle();
	}); 

	//==========================================================================
	// Initialization
	//==========================================================================
	$.get( '/isLogged', function( res ) {
		if( res ) {
			chat.dock.load( '/modules/dock/auth' );
		} else {
			chat.dock.load( '/modules/dock/' );
		}
	});

	chat.resize();

	window.onresize = function( event ) {
		chat.resize();
	}

	chat.input.button.fadeTo( 0, 0.7 );
}
