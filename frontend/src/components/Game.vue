<template>
  <div class="flex mt-5 gap-10 flex-wrap">
    <section class="flex-1">
      <h2 class="text-3xl mb-2">Log</h2>
      <ul class="border-2 border-black overflow-y-scroll list-none" style="height: 70vh">
        <message ref="message" v-for="message in messages" :key="message.time" :message="message"></message>
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

<script>
import socket from "../plugins/socketio.js";
import Message from "./Message.vue";

export default {
  name: "Game",
  components: {
    Message,
  },
  data() {
    return {
      players: [],
      messages: [],
      usedLetters: [],
    };
  },
  created() {

    // Let the server know that the user has joined and can be sent a user list.
    socket.emit("loaded");

    socket.on("users", (users) => {
      if (users.length > 1) {
        const lastUser = users.pop().username;

        var usernameList = [];
        users.forEach(user => {

          usernameList.push(user.username);
        });

        this.addMessage(`${usernameList.join(", ")} and ${lastUser} are already in the game.`);
      } else if (users.length === 1) {
        this.addMessage(`${users[0].username} is already in the game.`);
      } else {
        this.addMessage("Currently, there are no users in this game.");
      }
    });

    socket.on("user connected", (person) => {
      this.addMessage(`${person.username} joined the game.`);
    });

    socket.on("user disconnected", (user) => {
      this.addMessage(`${user.username} left the game.`);
    });

    socket.on("picked letter", (letter) => {
      this.usedLetters.unshift({
        id: Date.now(),
        name: letter,
      });
      this.addMessage("picked letter", letter);
    });

    socket.on("put back letter", (letter) => {
      this.usedLetters.splice(this.usedLetters.indexOf(letter), 1);
      this.addMessage("put back letter", letter);
    });

    socket.on("someone put back letter", (user) => {
      this.addMessage(user + " put back a letter.");
    });

    socket.on("someone picked letter", (username) => {
      this.addMessage(`${username} picked up a letter`);
    });

    socket.on("letterset not initialised", (username) => {
      this.addMessage(
        `${username} tried to get a letter but the letterset is empty!`
      );
    });

    socket.on("reset", (username) => {
      this.messages = [];
      this.usedLetters = [];
      this.addMessage(`${username} reset the game.`);
    });
  },
  methods: {
    addMessage(message, letter) {
      this.messages.push({
        message: message,
        time: Date.now(),
        letter: letter,
      });
      this.$nextTick(() => this.$refs.message[this.$refs.message.length - 1].$el.scrollIntoView({alignToTop: false}));
    },
    reset() {
      if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        socket.emit("reset");
      }
    },
    getLetter() {
      socket.emit("get letter");
    },
    undo() {
      if (window.confirm(`Are you sure you want to return ${this.usedLetters[0].name}?`)) {
        socket.emit("undo letter");
      }
    },
  },
};
</script>
