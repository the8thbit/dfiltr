var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../config.js"><\/script>' );

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/' );
	var field = document.getElementById( 'chat-input-field' );
	var fieldWrapper = document.getElementById( 'chat-input-field-wrapper' );
	var sendButton = document.getElementById( 'chat-input-send' );
	var connectButton = document.getElementById( 'chat-input-disconnect' );
	var content = document.getElementById( 'chat-output' );
	
	connectButton.state = 'DISCONNECT';

	//ENTER KEY: send message 
	$( 'textarea' ).keydown( function( e ){
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( { message: field.value, type:'self' } );
			sendMessage( field.value );
		}
	});

	//ESC KEY: end discussion/start new discussion
	$( document ).keyup( function( e ){
		if( e.keyCode == 27 ) {
			e.preventDefault();
			connectToggle( );
		}
	});

	sendButton.onclick = function() {
		addMessage( { message: field.value, type:'self' } );
		sendMessage( field.value );
	};

	connectButton.onclick = function() {
		connectToggle( );
	};

	//what to do when the user recieves a message
	socket.on( 'message', function( data ) {
		addMessage( data );
	});

	socket.on( 'partner connected', function() {
		console.log( 'partner connected' );
		content.value = '';
		fieldWrapper.style.backgroundColor = 'white';
		field.readOnly = false;
		field.style.visibility = 'visible';
		field.focus();
	});

	socket.on( 'partner disconnected', function() {
		socket.emit( 'virtual disconnect' );
		fieldWrapper.style.backgroundColor = '#eeeeee';
		field.readOnly = true;
		field.style.visibility = 'hidden';
		field.value = '';
		connectButton.value = 'new discussion';
		connectButton.state = 'NEW';
	}); 

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
			content.innerHTML = html;
			content.scrollTop = content.scrollHeight * 10;
		} else if( !data || !data.message || !data.type ) {
			console.log( 'error transporting message' );
		}
	};

	sendMessage = function( text ) {
		if( text != '' ) {
			field.value = '';
			socket.emit( 'send', { message: text } );
			console.log( 'you: ', text );
		}
	};

	clearOutput = function( ) {
		console.log( 'clearing output...' );
		messages = [];
		content.innerHTML = '';
		content.scrollTop = content.scrollHeight * 10;
	};

	connectToggle = function( ) {
		if( connectButton.state == 'DISCONNECT' ) {
			socket.emit( 'virtual disconnect' );
			addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
			fieldWrapper.style.backgroundColor = '#eeeeee';
			field.readOnly = true;
			field.style.visibility = 'hidden';
			field.value = '';
			connectButton.value = 'new discussion';
			connectButton.state = 'NEW';
		} else if( connectButton.state == 'NEW' ) {
			clearOutput( );
			connectButton.value = 'disconnect';
			connectButton.state = 'DISCONNECT';
			socket.emit( 'virtual connection' );
		}
	};
}
