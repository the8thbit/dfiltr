//====================================
//SERVER CONFIGURATION
//====================================
//IP ADDRESS 
  var IP_ADD =
  'localhost'; //toggle on for local testing
//process.env.OPENSHIFT_NODEJS_IP; //toggle on for openshift deploy
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
var sockets = []; //list of all users
var pool = [];    //pool of unconnected users

io.sockets.on('connection', function (socket) {
	console.log('user connecting...');
	console.log('| user added to list of users at position ' + sockets.push(socket));
	socket.emit('message', { message: 'welcome to the chat.' });

	if( pool.length ) {
		var partner = pool.shift();
		partner.pool = null;
		socket.partner = partner;
		partner.partner = socket;
		socket.partner.emit('message', { message: 'You\'ve been paired with a user.' });
		partner.partner.emit('message', { message: 'You\'ve been paired with a user.' });
	} else {
		socket.pool = pool.push(socket);
		socket.emit('message', { message: 'Looking for a partner...' });
	}

	//when server recieves 'send' relay 'message' to client 
	socket.on('send', function (data) {
		if( socket.partner ) {
			socket.partner.emit('message', data);
		} else {
			socket.emit('message', { message: 'We are having technical difficulties. You don\'t have a partner, but you think you do. Basically, you\'re far more alone than you believe. Let\'s get you someone new to talk to.' });
			if( !socket.pool ) {
				socket.pool = pool.push(socket); 
			}  
			socket.emit('message', { message: 'Looking for a partner...' });
		}
	});

	socket.on('disconnect', function () {		
		console.log('user disconnecting...');

		if( socket.pool ) {
			console.log("| user is in pool at position " + socket.pool );
			console.log("| current size of pool is " + pool.length);
			console.log("| removing user from pool...");	
			pool.splice( socket.pool - 1, 1);
			socket.pool = null;
			console.log("| current size of pool is " + pool.length);
		}

		if( socket.partner ) {
			console.log("| user has a conversational partner");
			console.log("| disconnecting user from partner...");
			socket.partner.emit('message', { message: 'Your conversational partner has disconnected.' });
			socket.partner.partner = null;
			socket.partner = null;
		}

		console.log('user disconnected');
	});
});
