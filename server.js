//====================================
//SERVER CONFIGURATION
//====================================
//IP ADDRESS 
  var IP_ADD =
 'localhost'; //toggle on for local testing
// process.env.OPENSHIFT_NODEJS_IP; //toggle on for openshift deploy
//======================================
//PORT NUMBER
  var PORT_NUM = 
  8080; //toggle on for local testing
//80;
//process.env.OPENSHIFT_NODEJS_PORT; //toggle on for openshift deploy
//====================================

//use express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

//use jade templates for HTML and CSS
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function(req, res){
	res.render('page');
});

//give node a location to listen on 
var io = require('socket.io').listen(
	app.listen(PORT_NUM, IP_ADD)
);

//turn websockets on
io.configure(function() {
	io.set('transports', ['websocket']);
});

console.log('listening at ' + IP_ADD + ' on port ' + PORT_NUM); //listening at IP on port PORT

//chat protocol code
io.sockets.on('connection', function (socket) {
	console.log('user has connected');
	socket.emit('message', { message: 'welcome to the chat' });

	//when server recieves 'send' send 'message' to clients 
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
