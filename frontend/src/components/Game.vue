<template>
  <div>
    <h2>users</h2>
    <ul>
      <player v-for="player in players" v-bind:key="player.userID" :player="player" />
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
      players: []
    };
  },
  created () {
    socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
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
  }
};
</script>
