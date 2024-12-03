<script setup lang="ts">
import { ref, nextTick } from "vue";
import socket from "../plugins/socketio.js";
import MessageComponent from "./Message.vue";
import type { Message } from "../types";
import type { User } from "shared/types"

const messages = ref<Array<Message>>([]);
const usedLetters = ref<Array<{id: number, name: string}>>([]);

const messageRefs = ref<Array<typeof MessageComponent>>([]);

// Let the server know that the user has joined and can be sent a user list.
socket.emit("loaded");

socket.on("users", (users: User[]) => {
  if (users.length > 1) {
    const lastUser = users.pop()?.name || "Unknown user";

    let usernameList: string[] = [];
    users.forEach((user: User) => {

      usernameList.push(user.name);
    });

    addMessage(`${usernameList.join(", ")} and ${lastUser} are already in the game.`);
  } else if (users.length === 1) {
    addMessage(`${users[0].name} is already in the game.`);
  } else {
    addMessage("Currently, there are no users in this game.");
  }
});

socket.on("user connected", (user: User) => {
  addMessage(`${user.name} joined the game.`);
});

socket.on("user disconnected", (user: User) => {
  addMessage(`${user.name} left the game.`);
});

socket.on("picked letter", (letter: string) => {
  usedLetters.value.unshift({
    id: Date.now(),
    name: letter,
  });
  addMessage("picked letter", letter);
});

socket.on("put back letter", (letter) => {
  usedLetters.value.splice(usedLetters.value.indexOf(letter), 1);
  addMessage("put back letter", letter);
});

socket.on("someone put back letter", (username: string) => {
  addMessage(username + " put back a letter.");
});

socket.on("someone picked letter", (username: string) => {
  addMessage(`${username} picked up a letter`);
});

socket.on("letterset not initialised", (username: string) => {
  addMessage(
    `${username} tried to get a letter but the letterset is empty!`
  );
});

socket.on("reset", (username: string) => {
  messages.value = [];
  usedLetters.value = [];
  addMessage(`${username} reset the game.`);
});


function addMessage(message: string, letter?: string) {
  messages.value.push({
    message: message,
    time: Date.now(),
    letter: letter,
  });
  nextTick(() => {
    if (messageRefs.value && messageRefs.value.length > 0) {
      messageRefs.value[messageRefs.value.length - 1].$el.scrollIntoView({alignToTop: false})
    }
  });
}
function reset() {
  if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
    socket.emit("reset");
  }
}
function getLetter() {
  socket.emit("get letter");
}
function undo() {
  if (window.confirm(`Are you sure you want to return ${usedLetters.value[0].name}?`)) {
    socket.emit("undo letter");
  }
}

</script>


<template>
  <div class="flex mt-5 gap-10 flex-wrap">
    <section class="flex-1">
      <h2 class="text-3xl mb-2">Log</h2>
      <ul class="border-2 border-black overflow-y-scroll list-none" style="height: 70vh">
        <MessageComponent ref="messageRefs" v-for="message in messages" :key="message.time" :message="message"></MessageComponent>
      </ul>
    </section>
    <section class="w-1/5">
      <h2 class="text-3xl mb-2">Controls</h2>
      <div class="flex flex-col gap-3">
        <button class="button bg-blue-400 text-gray-100" @click="getLetter()">Get letter</button>
        <button class="button bg-red-500 text-gray-100" @click="reset()">Reset</button>
        <button class="button bg-yellow-600 text-gray-100" @click="undo()" :disabled="usedLetters.length == 0">Put back</button>
      </div>
    </section>
  </div>
</template>
