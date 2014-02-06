window.onload = function() {
	var messages = [];
	var socket = io.connect('http://localhost:8080/'); //toggle on for local testing
	//var socket = io.connect("http://435-teamnoname.rhcloud.com:8000/"); //toggle on for openshift deploy
	var field = document.getElementById("chat-input-field");
	var sendButton = document.getElementById("chat-input-send");
	var content = document.getElementById("chat-output");
 
	socket.on('message', function (data) {
		if(data.message) {
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
			var text = field.value;
			field.value = '';
			console.log("you: ", text);
			socket.emit('send', { message: text });
			content.scrollTop = content.scrollHeight * 10;
		}
	}); 

	sendButton.onclick = function() {
		var text = field.value;
		field.value = '';
		console.log("you: ", text);
		socket.emit('send', { message: text });
		content.scrollTop = content.scrollHeight + 1;
	};
}
