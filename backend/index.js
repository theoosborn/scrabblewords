// Setup express server
const httpServer = require("http").createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

httpServer.listen(3001, () => {
    console.log('Server listening at port 3001');
});

// Scrabble room

var numUsers = 0;

// Game functions
var randomisedLetters = []; // The letters available to players in the game. They have been randomised.

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                  "U", "V", "W", "X", "Y", "Z", "0"];
const numLetters = [9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1, 2];

function addLetters(item, index) {
    var repeatLetter = item;
    // Add correct number of each letter for a scrabble game
    while (repeatLetter > 0) {
        randomisedLetters.push(alphabet[index]);
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

function pickLetter() {
    let letterPicked = randomisedLetters.pop();
    if (letterPicked == "0") {
        letterPicked = "&#10240;";
    }
    return letterPicked;
}

// Middleware to handle login.
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("Invalid username."));
    }
    if (username.length > 32) {
        return next(new Error("Usernames must be less than 32 characters."))
    }
    for (let [, socket] of io.of("/").sockets) {
        if (username === socket.username) {
            return next(new Error("Username is taken."))
        }
    }
    socket.username = username;
    next();
});


io.on("connection", (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    socket.emit("users", users);
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username
    });

    // Server functions

    socket.on('disconnect', () => {
        --numUsers;

        // Reset the game if everybody has left.
        if (numUsers.length === 0) {
            randomisedLetters = [];
        }

        // echo globally that this client has left
        socket.broadcast.emit('user has left', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    socket.on('wordset init', () => {
        if (randomisedLetters.length === 0) {

            numLetters.forEach(addLetters);
            shuffleArray(randomisedLetters);

            io.emit('send message', {
                username: socket.username,
                message: socket.username + " has initialised the wordset."
            });

        } else {
            io.emit('send message', {
                username: socket.username,
                message: socket.username + " attempted to initialise the wordset but it already exists."
            });
        }
    });

    socket.on('letter picked', () => {
        if (randomisedLetters.length !== 0) {
            // Emit message to client who picked letter.
            socket.emit('you_picked_letter', {
                message: pickLetter()
            });
            // Emit message to all other than client.
            socket.broadcast.emit('someone_picked_letter', {
                username: socket.username
            });
        } else {
            io.emit('send message', {
                username: socket.username,
                message: socket.username + " attempted to get a letter but either the wordset array has not been " +
                                           "initialised or you've run out of letters!"
            });
        }

    });

    socket.on('reset', () => {
        randomisedLetters = [];
        io.emit('send message', {
            username: socket.username,
            message: socket.username + " has reset the game."
        });
    });
});
