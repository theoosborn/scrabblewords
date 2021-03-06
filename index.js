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

// Game functions
var wordset = [];

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0"];
const numLetters = [9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1, 2];
function addLetters(item, index) {
    var repeatLetter = item;
    // Add correct number of each letter for a scrabble game
    while (repeatLetter > 0) {
            wordset.push(alphabet[index]);
        repeatLetter--;
  }
}

// Durstenfeld shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



io.on('connection', (socket) => {

    // Some game code
    const pickLetter = () => {
        var letterPicked = wordset.pop();
        if (letterPicked == "0") {
            letterPicked = "&#10240;";
        }
        return letterPicked;
        /* old code
        $messages.prepend("<p class='message'>Either the wordset array has not been initialised or you've run out of letters!</p>")
        console.log("Either the wordset array has not been initialised or you've run out of letters!");
        */
    }; 


    var addedUser = false;

    // Server functions

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

    socket.on('wordset init', () => {
        if (wordset.length == 0) {
            numLetters.forEach(addLetters);
            // Shuffle the array
            shuffleArray(wordset);
            io.emit('send message', {
                username: socket.username,
                message: socket.username + " has initialised the wordset"
            });
        } else {
            io.emit('send message', {
                username: socket.username,
                message: socket.username + " attempted to initialise the wordset but it already exists."
            });
        }
    });

    socket.on('letter picked', () => {
        if (wordset.length != 0) {
            var letterPicked = pickLetter();
            io.emit('letter picked', {
                username: socket.username,
                message: letterPicked
            });
        } else {
            io.emit('send message', {
                username: socket.username,
                message: socket.username + " attempted to get a letter but either the wordset array has not been initialised or you've run out of letters!"
            });
        }

    });

    socket.on('reset', () => {
        wordset = [];
        io.emit('send message', {
            username: socket.username,
            message: socket.username + " has reset the game."
        });
    });
});