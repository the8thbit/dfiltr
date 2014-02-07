window.onload = function() {

//============================
//CLIENT CONFIGURATION
//============================
//IP ADDRESS
  var IP_ADD = 
//"localhost"; //toggle on for local testing
  "435-teamnoname.rhcloud.com"; //toggle on for openshift deploy
//----------------------------
//PORT NUMBER
  var PORT_NUM = 
//8080; //use with localhost
//80;
  8000; //neccessary for openshift, as websockets is restricted to this port
//---------------------------- 

	var messages = [];
	var socket = io.connect("http://" + IP_ADD + ":" + PORT_NUM + "/" );
	var field = document.getElementById("chat-input-field");
	var sendButton = document.getElementById("chat-input-send");
	var content = document.getElementById("chat-output");
	var id;

	socket.on('setid', function (data) {
		if(data.id) {
			id = data.id;
		}
	});
 
	socket.on('message', function (data) {
		if(data.message && data.id != id && data.message != '') {
			messages.push(data.message);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += messages[i] + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log("error transporting message:", data);
		}
	});
 
	$("textarea").keydown(function(e){
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault();
			sendMessage( field.value );	
		}
	}); 

	sendButton.onclick = function() {
		sendMessage( field.value );
	};

	function sendMessage( text ) {
		field.value = '';
		if( text && text != '' ) {
			messages.push(text);
				var html = '';
				for(var i=0; i<messages.length; i++) {
					html += messages[i] + '<br />';
				}
			content.innerHTML = html;
			content.scrollTop = content.scrollHeight * 10;
			console.log("you: ", text);
			socket.emit('send', { message: text, id: id });
		}
	};
}
