var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../config.js"><\/script>' );

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/' );
	var field = document.getElementById( 'chat-input-field' );
	var fieldWrapper = document.getElementById( 'chat-input-field-wrapper' );
	var sendButton = document.getElementById( 'chat-input-send' );
	var newButton = document.getElementById( 'chat-input-disconnect' );
	var content = document.getElementById( 'chat-output' );
	
	newButton.state = 'DISCONNECT';
 
	$( 'textarea' ).keydown( function( e ){
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( { message: field.value, type:'self' } );
			sendMessage( field.value );
		}
	}); 

	$( document ).keyup( function( e ){
		if( e.keyCode == 27 ) {
			e.preventDefault();
			if( newButton.state == 'DISCONNECT' ) {
				socket.emit( 'virtual disconnect' );
				addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
				fieldWrapper.style.backgroundColor = '#eeeeee';
				field.readOnly = true;
				field.style.visibility = 'hidden';
				field.value = '';
				newButton.value = 'new discussion';
				newButton.state = 'NEW';
			} else if( newButton.state == 'NEW' ) {
				clearOutput( );
				newButton.value = 'disconnect';
				newButton.state = 'DISCONNECT';
				socket.emit( 'virtual connection' );
			}
		}
	});

	sendButton.onclick = function() {
		addMessage( { message: field.value, type:'self' } );
		sendMessage( field.value );
	};

	newButton.onclick = function() {
		if( newButton.state == 'DISCONNECT' ) {
			socket.emit( 'virtual disconnect' );
			addMessage( { message: 'You have disconnected.', type:'server' } ); //spoof the server because its easier and more efficient this way
			fieldWrapper.style.backgroundColor = '#eeeeee';
			field.readOnly = true;
			field.style.visibility = 'hidden';
			field.value = '';
			newButton.value = 'new discussion';
			newButton.state = 'NEW';
		} else if( newButton.state == 'NEW' ) {
			clearOutput( );
			newButton.value = 'disconnect';
			newButton.state = 'DISCONNECT';
			socket.emit( 'virtual connection' );
		}
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
		newButton.value = 'new discussion';
		newButton.state = 'NEW';
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
	}

	clearOutput = function( ) {
		console.log( 'clearing output...' );
		messages = [];
		content.innerHTML = '';
		content.scrollTop = content.scrollHeight * 10;
	};

}
