<template>
  <div>
    <div class="main">
      <section>
        <h2>Log</h2>
        <ul class="messages">
          <message ref="message" v-for="message in messages" :key="message.time" :message="message"></message>
        </ul>
      </section>
      <section class="sidebar">
        <h2>Controls</h2>
        <button @click="getLetter()">Get letter</button>
        <button @click="reset()">Reset</button>
        <button @click="undo()">Put back</button>
      </section>
    </div>
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

    socket.on("user connected", (person) => {
      this.addMessage(`${person.username} has joined the game.`);
    });

    socket.on("user disconnected", (user) => {
      this.addMessage(`${user.username} has left the game.`);
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
    initialisePerson(user) {
      user.self = user.userID === socket.id;
    },
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
      socket.emit("undo letter");
    },
    sortPlayers(players) {
      players.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    }
  },
};
</script>

<style scoped>
.main {
  display: flex;
}
section {
  flex: 3;
}
.sidebar {
  flex: 1;
}
.messages {
  overflow-y: scroll;
  height: 70vh;
  border-style: solid;
  list-style-type: none;
}
</style>
