<template>
  <div id="app">
    <header class="header">
      <h1>crabble</h1>
    </header>
    <select-username
      :error="connectError"
      v-if="!isLoggedIn"
      @submit="onUsernameSelection"
    />
    <game v-else />
  </div>
</template>

<script>
import SelectUsername from "./components/SelectUsername.vue";
import Game from "./components/Game.vue";
import socket from "./plugins/socketio.js";

export default {
  name: "App",
  components: {
    SelectUsername,
    Game,
  },
  data: function () {
    return {
      isLoggedIn: false,
      connectError: null,
    };
  },
  methods: {
    onUsernameSelection(username) {
      socket.auth = { username };
      socket.connect();
    },
  },
  created() {
    socket.on("connect_error", (err) => {
      this.connectError = err;
      this.isLoggedIn = false;
    });

    socket.on("connect", () => {
      this.isLoggedIn = true;
    });
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;900&display=swap');
html {
  font-family: Merriweather, serif;
  background-color: #ffedcb;
  text-align: center;
  font-size: 20px;
}

h1 {
  text-transform: uppercase;
}

#app {
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
}
</style>
