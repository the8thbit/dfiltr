var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../config.js"><\/script>' );

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/' );
	var field = $( '#chat-input-field' );
	var fieldWrapper = $( '#chat-input-field-wrapper' );
	var sendButton = $( '#chat-input-send' );
	var connectButton = $( '#chat-input-disconnect' );
	var content = $( '#chat-output' );
	
	connectButton.data( 'state', 'DISCONNECT' );

	//===============================================
	// User Interface
	//===============================================
	$( document ).keydown( function( e ){
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( { message: field.prop( 'value' ), type:'self' } );
			sendMessage( field.prop( 'value' ) );
		}
	});

	$( document ).keyup( function( e ){
		//ESC KEY: end discussion/start new discussion
		if( e.keyCode == 27 ) {
			e.preventDefault();
			connectToggle( );
		}
	});

	sendButton.on( 'click', function() {
		addMessage( { message: field.prop( 'value' ), type:'self' } );
		sendMessage( field.prop( 'value' ) );
	});

	connectButton.on( 'click', function() {
		connectToggle( );
	});


	//===============================================
	// Chat Protocol
	//===============================================
	//what to do when the user recieves a message
	socket.on( 'message', function( data ) {
		addMessage( data );
	});

	//what to do when the user finds a chat partner
	socket.on( 'partner connected', function() {
		console.log( 'partner connected' );
		content.prop( 'value', '' );
		fieldWrapper.css( 'background-color', 'white' );
		field.prop( 'readOnly', false );
		field.css( 'visibility', 'visible' );
		field.focus();
	});

	//what to do when a chat partner disconnects
	socket.on( 'partner disconnected', function() {
		socket.emit( 'virtual disconnect' );
		fieldWrapper.css( 'background-color', '#eeeeee' );
		field.prop( 'readOnly', true );
		field.prop( 'value', '' );
		field.css( 'visibility', 'hidden' );
		connectButton.prop( 'value', 'new discussion' );
		connectButton.data( 'state', 'NEW' );
	}); 


	//===============================================
	// Internal Functions
	//===============================================
	//adds a new line to the output pane
	addMessage = function( data ) {
		console.log( data );
		if( data && data.message && data.message != '' && data.type ) {
			if( data.type == 'server'  ) { var text = '<span class="chat-message-server">'  + data.message + '</span>'; } else
			if( data.type == 'partner' ) { var text = '<span class="chat-message-partner">' + data.message + '</span>'; }
			if( data.type == 'self'    ) { var text = '<span class="chat-message-self">'    + data.message + '</span>'; }
			messages.push( text );
			var html = '';
			for( var i=0; i < messages.length; i++ ) {
				html += messages[i] + '<br />';
			}
			content.html( html );
			content.scrollTop( content.height() );
		} else if( !data || !data.message || !data.type ) {
			console.log( 'error transporting message' );
		}
	};

	//sends a message to partner
	sendMessage = function( text ) {
		if( text != '' ) {
			field.prop( 'value', '' );
			socket.emit( 'send', { message: text } );
			console.log( 'you: ', text );
		}
	};

	//clears the chat output window
	clearOutput = function( ) {
		console.log( 'clearing output...' );
		messages = [];
		content.html( '' );
		content.scrollTop( content.height() );
	};

	//this function will either create a new virtual connection, or end the current virtual connection
	connectToggle = function( ) {
		if( connectButton.data( 'state' ) == 'DISCONNECT' ) {
			socket.emit( 'virtual disconnect' );
			addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
			fieldWrapper.css( 'background-color', '#eeeeee' );
			field.prop( 'readOnly', true );
			field.prop( 'value', '' );
			field.css( 'visibility', 'hidden' );
			connectButton.prop( 'value', 'new discussion' );
			connectButton.data( 'state', 'NEW' );
		} else if( connectButton.data( 'state' ) == 'NEW' ) {
			clearOutput( );
			connectButton.prop( 'value', 'disconnect' );
			connectButton.data( 'state', 'DISCONNECT' );
			socket.emit( 'virtual connection' );
		}
	};
}
