// Setup express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, () => {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Scrabble room

var numUsers = 0;

io.on('connection', (socket) => {
	var addedUser = false;

	socket.on('new message', (data) => {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});

	socket.on('add user', (username) => {
		if (addedUser) return;

		// store the username in the socket session for this client
		socket.username = username;
		++numUsers;
		addedUser = true;
		socket.emit('login', {
			numUsers: numUsers
		});
		// echo globally that a person has connected
		socket.broadcast.emit('user has joined', {
			username: socket.username,
			numUsers: numUsers
		});
	});

	socket.on('disconnect', () => {
		if (addedUser) {
			--numUsers;

			// echo globally that this client has left
			socket.broadcast.emit('user has left', {
				username: socket.username,
				numUsers: numUsers
			});
		}
	});
});