var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../config.js"><\/script>' );

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/' );
	var field = document.getElementById( 'chat-input-field' );
	var sendButton = document.getElementById( 'chat-input-send' );
	var discButton = document.getElementById( 'chat-input-disconnect' );
	var content = document.getElementById( 'chat-output' );
 
	$( 'textarea' ).keydown( function( e ){
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( { message: field.value, type:'self' } );
			sendMessage( field.value );
		}
	} ); 

	sendButton.onclick = function() {
		addMessage( { message: field.value, type:'self' } );
		sendMessage( field.value );
	};

	discButton.onclick = function() {
		socket.emit( 'virtual disconnect' } );
	};

	//what to do when the user recieves a message
	socket.on( 'message', function( data ) {
		addMessage( data );
	});

	socket.on( 'partner connected', function() {
		console.log( 'partner connected' );
		content.value = '';
		field.style.backgroundColor = 'white';
		field.readOnly = false;
	});

	socket.on( 'partner disconnected', function() {
		field.style.backgroundColor = '#eeeeee';
		field.readOnly = true;
		field.value = '';
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
}
