window.onload = function() {
	var messages = [];
	//var socket = io.connect('http://localhost:8080');
	//var uri = "http://" + process.env.OPENSHIFT_NODEJS_IP + ":" + process.env.OPENSHIFT_NODEJS_PORT;
	var socket = io.connect("http://435-teamnoname.rhcloud.com/:8080");
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
 
	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data.message);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += messages[i] + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log("error sending message:", data);
		}
	});
 
	sendButton.onclick = function() {
		var text = field.value;
		console.log("you: ", text);
		socket.emit('send', { message: text });
	};
}
