var process = 'CLIENT'; //neccesary hacky code for the unified config file to work

document.write( '<script type="text/javascript" src="../config.js">' );
document.write( '<\/script>' );

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + 'localhost' + ':' + '8080' + '/' );
	var field = document.getElementById( 'chat-input-field' );
	var sendButton = document.getElementById( 'chat-input-send' );
	var content = document.getElementById( 'chat-output' );
 
	$( 'textarea' ).keydown( function( e ){
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			addMessage( field.value );
			sendMessage( field.value );
		}
	} ); 

	sendButton.onclick = function() {
		addMessage( field.value );
		sendMessage( field.value );
	};

	//what to do when the user recieves a message
	socket.on( 'message', function( data ) {
		addMessage( data.message );
	});

	//what to do when an event is triggered on the user's socket
	socket.on( 'event', function( data ) {
		console.log( data.type );
		if( data.type == 'partner connected' ) {
			content.value = '';
			field.style.backgroundColor = 'white';
			field.readOnly = false;
		} else if( data.type == 'partner disconnected' ) {
			field.style.backgroundColor = '#eeeeee';
			field.readOnly = true;
			field.value = '';
		}
	}); 

	addMessage = function( text ) {
		if( text && text != '' ) {
			messages.push( text );
			var html = '';
			for( var i=0; i < messages.length; i++ ) {
				html += messages[i] + '<br />';
			}
			content.innerHTML = html;
			content.scrollTop = content.scrollHeight * 10;
		} else if( !text ) {
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
