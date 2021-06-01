// Setup express server
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    },
});

httpServer.listen(3001, () => {
    console.log("Server listening at port 3001");
});

// Scrabble room

// Game functions
var randomisedLetters = []; // The letters available to players in the game. They have been randomised.

const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
];
const numLetters = [
    9,
    2,
    2,
    4,
    12,
    2,
    3,
    2,
    9,
    1,
    1,
    4,
    2,
    6,
    8,
    2,
    1,
    6,
    4,
    6,
    4,
    2,
    2,
    1,
    2,
    1,
    2,
];

function addLetter(item, index) {
    // Add correct number of each letter for a scrabble game
    for (let i = item; i > 0; i--) {
        randomisedLetters.push(alphabet[index]);
    }
}

// Durstenfeld shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function pickLetter(socket) {
    let letterPicked = randomisedLetters.pop();
    socket.usedLetters.push(letterPicked);
    return letterPicked;
}

function resetGame(socket) {
    randomisedLetters = [];
    socket.usedLetters = [];
    numLetters.forEach(addLetter);
    shuffleArray(randomisedLetters);
}

// Middleware to handle login.
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("Invalid name."));
    }
    if (username.length > 32) {
        return next(new Error("Names must be less than 32 characters."));
    }
    for (let [, socket] of io.of("/").sockets) {
        if (username === socket.username) {
            return next(new Error("That name is taken."));
        }
    }
    socket.username = username;
    socket.usedLetters = [];
    next();
});

io.on("connection", (socket) => {
    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    socket.emit("users", users);
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
    });

    // Server functions

    socket.on("disconnect", () => {
        // Reset the game if everybody has left.
        if (io.of("/").sockets.size === 0) {
            resetGame(socket);
        }

        // echo globally that this client has left
        socket.broadcast.emit("user disconnected", {
            userID: socket.id,
            username: socket.username,
        });
    });

    socket.on("get letter", () => {
        if (randomisedLetters.length !== 0) {
            // Emit message to client who picked letter.
            socket.emit("picked letter", pickLetter(socket));
            // Emit message to all other than client.
            socket.broadcast.emit("someone picked letter", socket.username);
        } else {
            io.emit("letterset not initialised", socket.username);
        }
    });

    socket.on("reset", () => {
        resetGame(socket);
        io.emit("reset", socket.username);
    });

    socket.on("undo letter", () => {
        if (socket.usedLetters.length > 0) {
            let letter = socket.usedLetters.pop();
            randomisedLetters.push(letter);
            shuffleArray(randomisedLetters);
            socket.emit("put back letter", letter);
            socket.broadcast.emit("someone put back letter", socket.username);
        }
    });
});
