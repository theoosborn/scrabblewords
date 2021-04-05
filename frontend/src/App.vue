<template>
  <div id="app">
    <header class="header">
        <h1>crabble</h1>
    </header>
    <select-username :error="connectError" v-if="!isLoggedIn" @submit="onUsernameSelection" />
    <div v-else>
      <ul>
        <li v-for="message in messages" v-bind:key="message.received">{{ message }}</li>
      </ul>
      <game />
    </div>
  </div>
</template>

<script>
import SelectUsername from "./components/SelectUsername.vue";
import Game from "./components/Game.vue"
import socket from "./plugins/socketio.js";

export default {
  name: 'App',
  components: {
    SelectUsername,
    Game
  },
  data: function() {
    return {
      isLoggedIn: false,
      connectError: null,
      messages: []
    }
  },
  methods: {
    onUsernameSelection(username) {
      this.isLoggedIn = true;
      socket.auth = { username };
      socket.connect();
    }
  },
  created() {
    socket.on("connect_error", err => {
      this.connectError = err;
      this.isLoggedIn = false;
    });
  }
}
</script>

<style>
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
