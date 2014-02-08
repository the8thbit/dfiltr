//============================
//CLIENT CONFIGURATION
//============================
//IP ADDRESS
  var IP_ADD = 
  "localhost"; //toggle on for local testing
//"435-teamnoname.rhcloud.com"; //toggle on for openshift deploy
//----------------------------
//PORT NUMBER
  var PORT_NUM = 
  8080; //use with localhost
//80;
//8000; //neccessary for openshift, as websockets is restricted to this port
//----------------------------

window.onload = function() {
	var messages = [];
	var socket = io.connect( 'http://' + IP_ADD + ':' + PORT_NUM + '/' );
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
 
	addMessage = function( text ) {
		if( text && text != '' ) {
			messages.push(text);
			var html = '';
			for( var i=0; i < messages.length; i++ ) {
				html += messages[i] + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log( 'error transporting message:', data );
		}
	};

	sendMessage = function( text ) {
		field.value = '';
		content.scrollTop = content.scrollHeight * 10;
		socket.emit( 'send', { message: text } );
		console.log( 'you: ', text );
	}
}
