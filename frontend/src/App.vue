<template>
  <div class="container mx-auto text-center text-xl h-screen">
    <header class="border-b-2 border-black">
      <h1 class="uppercase text-4xl">crabble</h1>
      <p>To creep, crawl, or clamber, like a crab.</p>
    </header>
    <select-username
      :error="connectError"
      v-if="!isLoggedIn"
      @submit="onUsernameSelection"
      class="grow place-content-center"
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
