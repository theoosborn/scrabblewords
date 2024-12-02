// Import environment variables
import 'dotenv/config'
import { Server, Socket } from 'socket.io';

// Setup server
const io = new Server({
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
    },
});

io.listen(3001);

// Scrabble room

// Game functions
var randomisedLetters: string[] = []; // The letters available to players in the game. They have been randomised.

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

function addLetter(item: number, index: number) {
    // Add correct number of each letter for a scrabble game
    for (let i = item; i > 0; i--) {
        randomisedLetters.push(alphabet[index]);
    }
}

// Durstenfeld shuffle the array
function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function pickLetter(socket: Socket) {
    let letterPicked = randomisedLetters.pop();
    socket.data.usedLetters.push(letterPicked);
    return letterPicked;
}

function resetGame(socket: Socket) {
    randomisedLetters = [];
    socket.data.usedLetters = [];
    numLetters.forEach(addLetter);
    shuffleArray(randomisedLetters);
}

// Middleware to handle login.
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    const room = socket.handshake.auth.room;
    if (!username) {
        return next(new Error("Invalid name."));
    }
    if (username.length > 32) {
        return next(new Error("Names must be less than 32 characters."));
    }
    for (let [, socket] of io.of("/").sockets) {
        if (username === socket.data.username) {
            return next(new Error("That name is taken."));
        }
    }

    socket.join(room);

    socket.data.username = username;
    socket.data.room = room;
    socket.data.usedLetters = [];
    next();
});

io.on("connection", (socket) => {
    // Server functions

    socket.on("loaded", () => {
        let users = [];
        for (let [id, userSocket] of io.of("/").sockets) {
            // Only send other users that are already connected.
            if (socket.id !== id) {
                users.push({
                    userID: id,
                    username: userSocket.data.username,
                });
            }
        }


        socket.emit("users", users);
        io.to(socket.data.room).emit("user connected", {
            userID: socket.id,
            username: socket.data.username,
        });
    });

    socket.on("disconnect", () => {
        // Reset the game if everybody has left.
        if (io.of("/").sockets.size === 0) {
            resetGame(socket);
        }

        // echo globally that this client has left
        socket.broadcast.to(socket.data.room).emit("user disconnected", {
            userID: socket.id,
            username: socket.data.username,
        });
    });

    socket.on("get letter", () => {
        if (randomisedLetters.length !== 0) {
            // Emit message to client who picked letter.
            socket.emit("picked letter", pickLetter(socket));
            // Emit message to all other than client.
            socket.broadcast.to(socket.data.room).emit("someone picked letter", socket.data.username);
        } else {
            io.emit("letterset not initialised", socket.data.username);
        }
    });

    socket.on("reset", () => {
        resetGame(socket);
        io.emit("reset", socket.data.username);
    });

    socket.on("undo letter", () => {
        if (socket.data.usedLetters.length > 0) {
            let letter = socket.data.usedLetters.pop();
            randomisedLetters.push(letter);
            shuffleArray(randomisedLetters);
            socket.emit("put back letter", letter);
            socket.broadcast.to(socket.data.room).emit("someone put back letter", socket.data.username);
        }
    });
});
