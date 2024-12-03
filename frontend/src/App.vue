<script setup lang="ts">
import SelectUsername from "./components/SelectUsername.vue";
import Game from "./components/Game.vue";
import socket from "./plugins/socketio.js";
import { ref } from "vue";

const isLoggedIn = ref(false);
const connectError = ref<Error | null>(null);

function onUsernameSelection(username: string) {
  socket.auth = { username };
  socket.connect();
}

socket.on("connect_error", (err) => {
  connectError.value = err;
  isLoggedIn.value = false;
});

socket.on("connect", () => {
  isLoggedIn.value = true;
});

</script>


<template>
  <div class="container mx-auto text-center text-xl h-screen">
    <header class="border-b-2 border-black">
      <h1 class="uppercase text-4xl">crabble</h1>
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
