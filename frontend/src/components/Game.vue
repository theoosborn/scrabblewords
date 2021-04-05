<template>
  <div>
    <h2>Users</h2>
    <ul>
      <player v-for="player in players" :key="player.userID" :player="player" />
    </ul>
    <h2>Log</h2>
    <ul>
      <li v-for="message in messages" :key="message.localID">
        {{ message.timestamp.toLocaleTimeString('en-GB') }} - {{ message.message }}
      </li>
    </ul>
    <button @click="initialiseLetterset()">Initialise letterset</button>
    <button @click="getLetter()">Get letter</button>
    <button @click="reset()">Reset</button>
    <h2>Letter History</h2>
    <ul>
      <li v-for="letter in usedLetters" :key="letter.id">{{ letter.name }}</li>
    </ul>
  </div>
</template>

<script>
import Player from './Player.vue';
import socket from '../plugins/socketio.js';

export default {
  name: 'Game',
  components: {
    Player
  },
  data () {
    return {
      players: [],
      messages: [],
      usedLetters: []
    };
  },
  created () {
    socket.on('users', (users) => {
      users.forEach((user) => {
        this.initialisePerson(user);
      });
      // Puts the current user first and sorts by username.
      this.players = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on('user connected', (person) => {
      this.players.push(person);
    });

    socket.on('user disconnected', (user) => {
      this.initialisePerson(user);
      this.players.splice(this.players.indexOf(user), 1);
    });

    socket.on('letterset initialised', (username) => {
      this.addMessage(`${username} initialised the letterset.`);
    });

    socket.on('letterset already exists', (username) => {
      this.addMessage(`${username} tried to initialise the letterset but it already exists!`);
    });

    socket.on('picked letter', (letter) => {
      this.usedLetters.push({
        id: Date.now(),
        name: letter
      });
      this.addMessage(`You picked up ${letter}.`);
    });

    socket.on('someone picked letter', (username) => {
      this.addMessage(`${username} picked up a letter`);
    });

    socket.on('letterset not initialised', (username) => {
      this.addMessage(`${username} tried to get a letter but the letterset is empty!`);
    });

    socket.on('reset', (username) => {
      this.messages = [];
      this.addMessage(`${username} reset the game.`);
    });
  },
  methods: {
    initialisePerson (user) {
      user.self = user.userID === socket.id;
    },
    addMessage (message) {
      const date = new Date(Date.now());
      this.messages.push({
        message: message,
        timestamp: date,
        localID: Date.now()
      });
    },
    reset () {
      socket.emit('reset');
    },
    initialiseLetterset () {
      socket.emit('initialise letterset');
    },
    getLetter () {
      socket.emit('get letter');
    }
  }
};
</script>
