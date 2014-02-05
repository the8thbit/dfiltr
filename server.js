//====================================
//SERVER CONFIGURATION
//====================================
//IP ADDRESS
  var IP_ADD =
//localhost;
  process.env.OPENSHIFT_NODEJS_IP;
//======================================
//PORT NUMBER
  var PORT_NUM = 
//8080;
//80;
  process.env.OPENSHIFT_NODEJS_PORT;
//====================================

var port="8080";
var express = require("express");
var app = express();

//use jade templates for HTML and CSS
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
	res.render("page");
});

//look for client files in the ./client directory
app.use(express.static(__dirname + '/client'));

//give node a port to listen on 
var io = require('socket.io').listen(
	app.listen(process.env.OPENSHIFT_NODEJS_PORT, IP_ADD)
);
console.log("Listening on port " + port);


io.sockets.on('connection', function (socket) {
	console.log("user has connected");
	socket.emit('message', { message: 'welcome to the chat' });

	//when server recieves 'send' send 'message' to clients 
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
