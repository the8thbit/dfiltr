var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../config.js"><\/script>' );

window.onload = function() {
	var socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/' );
	var messages = []; //the list of all messages to the user

	var inputField =        $( '#chat-input-field' );         //the textarea that the user can type into and send messages from
	var inputFieldWrapper = $( '#chat-input-field-wrapper' ); //the wrapper for the aforementioned textarea
	var inputSend =         $( '#chat-input-send' );          //the button used to send messages
	var inputConnect =      $( '#chat-input-connect' );       //the button used to connect/disconnect from a discussion
	var output =            $( '#chat-output' );              //the place where conversations go
	
	inputConnect.data( 'state', 'DISCONNECT' ); //adds states to the connect/disconnect button to swap between the two

	//===============================================
	// User Interface
	//===============================================
	$( document ).keydown( function( e ){
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( { message: inputField.prop( 'value' ), type:'self' } );
			sendMessage( inputField.prop( 'value' ) );
		}
	});

	$( document ).keyup( function( e ){
		//ESC KEY: end discussion/start new discussion
		if( e.keyCode == 27 ) {
			e.preventDefault();
			connectToggle( );
		}
	});

	inputSend.on( 'click', function() {
		addMessage( { message: inputField.prop( 'value' ), type:'self' } );
		sendMessage( inputField.prop( 'value' ) );
	});

	inputConnect.on( 'click', function() {
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
		output.prop( 'value', '' );
		inputFieldWrapper.css( 'background-color', 'white' );
		inputField.prop( 'readOnly', false );
		inputField.css( 'visibility', 'visible' );
		inputField.focus();
	});

	//what to do when a chat partner disconnects
	socket.on( 'partner disconnected', function() {
		socket.emit( 'virtual disconnect' );
		inputFieldWrapper.css( 'background-color', '#eeeeee' );
		inputField.prop( 'readOnly', true );
		inputField.prop( 'value', '' );
		inputField.css( 'visibility', 'hidden' );
		inputConnect.prop( 'value', 'new discussion' );
		inputConnect.data( 'state', 'NEW' );
	}); 


	//===============================================
	// Internal Functions
	//===============================================
	//adds a new line to the output field
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
			output.html( html );
			output.scrollTop( output.height() );
		} else if( !data || !data.message || !data.type ) {
			console.log( 'error transporting message' );
		}
	};

	//sends a message to partner
	sendMessage = function( text ) {
		if( text != '' ) {
			inputField.prop( 'value', '' );
			socket.emit( 'send', { message: text } );
			console.log( 'you: ', text );
		}
	};

	//clears the output field
	clearOutput = function( ) {
		console.log( 'clearing outputinputField...' );
		messages = [];
		output.html( '' );
		output.scrollTop( output.height() );
	};

	//this function will either create a new virtual connection, or end the current virtual connection
	//depending upon the state of inputConnect
	connectToggle = function( ) {
		if( inputConnect.data( 'state' ) == 'DISCONNECT' ) {
			socket.emit( 'virtual disconnect' );
			addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
			inputFieldWrapper.css( 'background-color', '#eeeeee' );
			inputField.prop( 'readOnly', true );
			inputField.prop( 'value', '' );
			inputField.css( 'visibility', 'hidden' );
			inputConnect.prop( 'value', 'new discussion' );
			inputConnect.data( 'state', 'NEW' );
		} else if( inputConnect.data( 'state' ) == 'NEW' ) {
			clearOutput( );
			inputConnect.prop( 'value', 'disconnect' );
			inputConnect.data( 'state', 'DISCONNECT' );
			socket.emit( 'virtual connection' );
		}
	};
}
