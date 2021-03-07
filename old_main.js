$(function() {

    // let's init some variables
    var usernameInput = $('.usernameInput');
    var usernameButton = $('.usernameButton');
    var initScrabbleArray = $('.initScrabbleArray');
    var getNextLetter = $('.getNextLetter');
    var resetButton = $('.resetButton');

    var loginPage = $('.login.page');
    var gamePage = $('.game.page');
    var messages = $('.messages');

    // Prompt for setting a username
    var username;
    var connected = false;
    var currentInput = usernameInput.focus();

    var socket = io();

    const sendMsg = (data, type) => {
        messages.prepend("<p class='message " + type + "'>" + data + "</p>");
    };

    const addParticipantsMessage = (data) => {
        let message = '';
        if (data.numUsers === 1) {
            message += "There's 1 participant.";
        } else {
            message += "There are " + data.numUsers + " participants.";
        }
        sendMsg(message);
    };

    // sets username for client

    const setUsername = () => {
        username = cleanInput(usernameInput.val().trim());

        // if it's valid...
        if (username) {
            loginPage.fadeOut();
            gamePage.fadeIn();
            loginPage.off('click');

            // tell the server the username
            socket.emit('add_user', username);
        }
    };

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    };

    // Scrabble game code starts here


    // Click events

    loginPage.click(() => {
        currentInput.focus();
    });

    usernameButton.click(() => {
        if (!username) {
            setUsername();
        }
    });

    initScrabbleArray.click(() => {
        socket.emit('wordset init');
    });

    getNextLetter.click(() => {
        socket.emit('letter picked');
    });

    resetButton.click(() => {
        socket.emit('reset');
    });

    // Socket events

    socket.on('login', (data) => {
        connected = true;
        addParticipantsMessage(data);
    });

    socket.on('user has joined', (data) => {
        sendMsg(data.username + ' joined.', "sys");
        addParticipantsMessage(data);
    });

    socket.on('send message', (data) => {
        sendMsg(data.message);
    });

    socket.on('user has left', (data) => {
        sendMsg(data.username + ' left.', "sys");
        addParticipantsMessage(data);
    });

    socket.on('disconnect', () => {
        sendMsg('You have been disconnected.', "sys");
    });

    socket.on('reconnect', () => {
        sendMsg('You have been reconnected.', "sys");
        if (username) {
            socket.emit('add_user', username);
        }
    });

    socket.on('reconnect error', () => {
        sendMsg('Attempt to reconnect has failed.', "sys");
    });

    socket.on('someone_picked_letter', (data) => {
        sendMsg(data.username + " has picked up a letter.");
    });

    socket.on('you_picked_letter', (data) => {
        sendMsg("You have picked up <span class='tile'>" + data.message + "</span>.");
    });
});
