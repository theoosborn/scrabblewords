<template>
  <div id="app">
    <header class="header">
        <h1>crabble</h1>
    </header>
    <SelectUsername :error="connectError" v-if="!isLoggedIn" @login-request="onUsernameSelection" />
    <div v-else>
      <li v-for="message in serverOutput" v-bind:key="message.received">{{ message }}</li>
    </div>
  </div>
</template>

<script>
import SelectUsername from "./components/SelectUsername.vue";
import socket from "./plugins/socketio.js";

export default {
  name: 'App',
  components: {
    SelectUsername
  },
  data: function() {
    return {
      test: true,
      isLoggedIn: false,
      connectError: ""
    }
  },
  methods: {
    onUsernameSelection(username) {
      this.loggedIn = true;
      socket.auth = { username };
      socket.connect();
    }
  },
  created() {
    socket.on("connect_error", (err) => {
      this.connectError = err;
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
