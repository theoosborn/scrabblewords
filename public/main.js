$(function() {
	var FADE_TIME = 150; //ms
	var COLORS = [
	    '#e21400', '#91580f', '#f8a700', '#f78b00',
    	'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    	'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	];

	// let's init some variables
	var $window = $(window);
	var $usernameInput = $('.usernameInput');
	var $usernameButton = $('.usernameButton');
	var $initScrabbleArray = $('.initScrabbleArray');
	var $getNextLetter = $('.getNextLetter');  

	var $loginPage = $('.login.page');
	var $gamePage = $('.game.page');

	// Prompt for setting a username
	var username;
	var connected = false;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	const addParticipantsMessage = (data) => {
		var message = '';
		if (data.numUsers === 1) {
			message += "there's 1 participant";
		} else {
			message += "there are " + data.numUsers + " participants";
		}
		log(message);
	}

	// sets username for client

	const setUsername = () => {
		username = cleanInput($usernameInput.val().trim());

		// if it's valid...
		if (username) {
			$loginPage.fadeOut();
			$gamePage.show();
			$loginPage.off('click');

			// tell the server the username
			socket.emit('add user', username);
		}
	}

	// Log a message
	const log = (message, options) => {
		var $el = $('<p>').addClass('log').text(message);
		
	}

	// Prevents input from having injected markup
	const cleanInput = (input) => {
    	return $('<div/>').text(input).html();
  	}

  	const getUsernameColor = (username) => {
  		// Compute hash code
  		var hash =7;
  		for (var i = 0; i < username.length; i++) {
  			hash = username.charCodeAt(i) + (hash << 5) - hash;
  		}
  		// Calculate color
  		var index = Math.abs(hash % COLORS.length);
  		return COLORS[index];
  	}

  	// Scrabble game code


	// Initialise the list of letters  	
  	// Durstenfeld shuffle the array
  	function shuffleArray(array) {
  		for (let i = array.length - 1; i > 0; i--) {
  			const j = Math.floor(Math.random() * (i + 1));
  			[array[i], array[j]] = [array[j], array[i]];
  		}
  	}

  	alphabet = 'abcdefghijklmnopqrstuvwxyz0'.split('');
  	numLetters = [9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1, 2];

  	var wordset = []; 
  	function addLetters(item, index) {
	  var repeatLetter = item;
	  // Add correct number of each letter for a scrabble game
      while (repeatLetter > 0) {
		  	wordset.push(alphabet[index]);
        repeatLetter--;
	  }
	  // Shuffle the array so you can't predict which letter you'll get
	  shuffleArray(wordset);
	}
	  
	function pickLetter() {
		if (wordset.length != 0) {
			console.log(wordset.pop());
		} else {
			console.log("Either the wordset array has not been initialised or you've run out of letters!");
		}
	} 


  	// Click events

  	$loginPage.click(() => {
  		$currentInput.focus();
  	});

  	$usernameButton.click(() => {
  		if (!username) {
  			setUsername();
  		}
  	});

    $initScrabbleArray.click(() => {
      numLetters.forEach(addLetters);
      console.log(wordset.toString());
	});
	
	$getNextLetter.click(() => {
		pickLetter();
	});

  	// Socket events

  	socket.on('login', (data) => {
  		connected = true;
  		var message = "Welcome to scrabblewords!";
  		log(message, { prepend: true });
  		addParticipantsMessage(data);
  	});

  	socket.on('user joined', (data) => {
  		log(data.username + ' joined');
  		addParticipantsMessage(data);
  	});


  	socket.on('user left', (data) => {
  		log(data.username + ' left');
  		addParticipantsMessage(data);
  	});

  	socket.on('disconnect', () => {
  		log('you have been disconnected');
  	});

  	socket.on('reconnect', () => {
  		log('you have been reconnected');
  		if (username) {
  			socket.emit('add user', username);
  		}
  	});

  	socket.on('reconnect error', () => {
  		log('attempt to reconnect has failed');
  	});


});