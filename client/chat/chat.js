var chat = $( '#chat' );

chat.resize = function(){
	$( '#chat-output-wrapper' ).css( { 'height' : 
		$( window ).height() - ( 
			$( '#chat-input-field-wrapper' ).outerHeight() + 
			$( '#chat-dock' ).outerHeight() +
			chat.margin * 3
		)
	});
	$( '#chat-input-field-wrapper' ).css( { 'width': 
		$( window ).width() - ( 
			$( '#chat-input-connect' ).outerWidth() + 
			$( '#chat-input-send' ).outerWidth() + 
			chat.margin * 4
		) 
	});
};

chat.authorize = function(){
	$.get( '/isLogged', function( res ){
		if( res ){
			$( '#chat-dock' ).load( '/modules/dock/auth' );
		} else {
			$( '#chat-dock' ).load( '/modules/dock/' );
		};
	});
}
	
//adds a new line to the output field
chat.addMessage = function( data ){
	if( data && data.message && data.message != '' && data.type ){
		data.message = data.message.replace( /\n/g, '<br />' ); //translates newlines from javascript to html
		data.message = data.message.replace( /\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;' ); //translates tabs from javascript to html
		if( data.type == 'server'  ){ var text = '<span class="chat-message-server">'  + data.message + '</span>'; } else
		if( data.type == 'partner' ){ var text = '<span class="chat-message-partner">' + data.message + '</span>'; } else
		if( data.type == 'self'    ){ var text = '<span class="chat-message-self">'    + data.message + '</span>'; } //else
		//if( data.type == 'debug'   ){ var text = '<span class="chat-message-debug">'   + data.message + '</span>'; }
		if( text ){ chat.messages.push( text ); }
		var html = '';
		for( var i=0; i < chat.messages.length; i++ ){
			html += chat.messages[i] + '<br />';
		}
		$( '#chat-output' ).html( html );
		$( '#chat-output' ).scrollTop( 99999999 );
	};
};

//sends a message to the partner
chat.sendMessage = function( text ){
	if( text != '' ){
		chat.addMessage( { message: text, type:'self' } );
		chat.inputField.prop( 'value', '' );
		chat.socket.emit( 'send', { message: text } );
	};
};

chat.clearOutput = function(){
	chat.messages = [];
	$( '#chat-output' ).html( '' );
	$( '#chat-output' ).scrollTop( 99999999 );
};

chat.hideInput = function(){
	$( '#chat-input-field-wrapper' ).css( 'background-color', '#eeeeee' );
	chat.inputField.prop( 'readOnly', true );
	chat.inputField.prop( 'value', '' );
	chat.inputField.css( 'visibility', 'hidden' );
}

chat.restoreInput = function(){
	$( '#chat-input-field-wrapper' ).html( chat.inputField ); //puts the input field back in its wrapper
	$( '#chat-input-field-wrapper' ).css( 'background-color', 'white' );
	chat.inputField.prop( 'readOnly', false );
	chat.inputField.prop( 'value', '' );
	chat.inputField.css( 'visibility', 'visible' );
	chat.inputField.focus();
}

//either create a new virtual connection, or end the current virtual connection
//depending upon the state of $( '#chat-input-connect' )
chat.connectButtonToggle = function(){
	if( $( '#chat-input-connect' ).data( 'state' ) == 'DISCONNECT' ){
		if( chat.socket.connected ){
			$( '#chat-input-field-wrapper' ).load( '/chat/ratings', function(){ ratings.init( chat.socket ); } );
			chat.sendButtonToggle();
		};
		chat.socket.connected = false
		chat.socket.emit( 'virtual disconnect' )
		chat.addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
		chat.hideInput();
		$( '#chat-input-connect' ).prop( 'value', 'new discussion' );
		$( '#chat-input-connect' ).data( 'state', 'NEW' );
	} else if( $( '#chat-input-connect' ).data( 'state' ) == 'NEW' ){
		chat.clearOutput();
		$( '#chat-input-connect' ).prop( 'value', 'disconnect' );
		$( '#chat-input-connect' ).data( 'state', 'DISCONNECT' );
		$( '#chat-input-field-wrapper' ).html( chat.inputField ); //puts the input field back in its wrapper
		chat.socket.emit( 'virtual connection' );
	}
};

chat.sendButtonToggle = function(){
	if( $( '#chat-input-send' ).data( 'state' ) == 'DISABLED' ){
		$( '#chat-input-send' ).data( 'state', 'ENABLED' );
		$( '#chat-input-send' ).css( 'background-color', '#0B5FA5' );
	} else {
		$( '#chat-input-send' ).data( 'state', 'DISABLED' );
		$( '#chat-input-send' ).css( 'background-color', '#999' );
	};
};

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
chat.createResizeEvent = function(){
	chat.resize();
	window.onresize = function( event ){ chat.resize(); }
}

chat.createHoverEvent = function(){
	$( '.chat-input-button' ).fadeTo( 0, 0.6 );
	$( '#chat-input-connect' ).hover( function(){
		$( this ).fadeTo( 'fast' , 1.0 );
	}, function(){
		$( this ).fadeTo( 'fast' , 0.6 );
	});

	$( '#chat-input-send' ).hover( function(){
		if( $( '#chat-input-send' ).data( 'state' ) == 'ENABLED' ){ $( this ).fadeTo( 'fast' , 1.0 ); }
	}, function(){
		$( this ).fadeTo( 'fast' , 0.6 );
	});
}

chat.createSendEvent = function(){
	$( '#chat-input-send' ).data( 'state', 'DISABLED' ); //adds states to the send button to show when you can't send messages
	$( document ).keydown( function( e ){
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ){
			e.preventDefault();
			chat.sendMessage( chat.inputField.prop( 'value' ) );
		};
	});
	$( '#chat-input-send' ).on( 'click', function(){
		chat.sendMessage( chat.inputField.prop( 'value' ) );
	});
}

chat.createDisconectEvent = function(){
	$( '#chat-input-connect' ).data( 'state', 'DISCONNECT' ); //adds states to the connect/disconnect button to swap between the two
	$( document ).keyup( function( e ){
		//ESC KEY: end discussion/start new discussion
		if( e.keyCode == 27 ){
			e.preventDefault();
			chat.connectButtonToggle();
		};
	});
	$( '#chat-input-connect' ).on( 'click', function(){
		chat.connectButtonToggle();
	});
}

chat.createEvents = function(){
	chat.createResizeEvent();
	chat.createHoverEvent();
	chat.createSendEvent();
	chat.createDisconectEvent();
}

//-----------------------------------------------------------------------------
// protocol
//-----------------------------------------------------------------------------
//what to do when the user recieves a message
chat.createRecieveProtocol = function(){
	chat.socket.on( 'message', function( data ){
		chat.addMessage( data );
	});
}

//what to do when the user finds a chat partner
chat.createConnectProtocol = function(){
	chat.socket.on( 'partner connected', function(){
		chat.clearOutput();
		chat.socket.connected = true;
		$( '#chat-output' ).prop( 'value', '' );
		chat.restoreInput();
		chat.sendButtonToggle();
	});
}

chat.createDisconnectProtocol = function(){
	//what to do when a chat partner disconnects
	chat.socket.on( 'partner disconnected', function(){
		chat.socket.connected = false;
		$( '#chat-input-field-wrapper' ).load( '/chat/ratings', function(){ ratings.init( chat.socket ); } );
		chat.socket.emit( 'virtual disconnect' );
		chat.hideInput();
		$( '#chat-input-connect' ).prop( 'value', 'new discussion' );
		$( '#chat-input-connect' ).data( 'state', 'NEW' );
		chat.sendButtonToggle();
	});
}

chat.createProtocols = function(){
	chat.createRecieveProtocol();
	chat.createConnectProtocol();
	chat.createDisconnectProtocol();
}

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------
window.onload = function(){
	chat.socket     = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/main' );
	chat.inputField = $( '#chat-input-field' );
	chat.messages   = []; //the list of all messages to the user
	chat.margin     = $( '#chat' ).css( 'margin-right' )[0];
	console.log( chat.margin );

	chat.authorize();
	chat.createEvents();
	chat.createProtocols();
};
