<template>
  <div>
    <div class="main">
      <section>
        <h2>Log</h2>
        <ul>
          <message v-for="message in messages" :key="message.localID">{{
            message.message
          }}</message>
        </ul>
      </section>
      <section class="sidebar">
        <h2>Controls</h2>
        <button @click="getLetter()">Get letter</button>
        <button @click="reset()">Reset</button>
        <button @click="undo()">Put back</button>
        <h2>{{ players.length }} player<template v-if="players.length !== 1">s</template></h2>
        <ul>
          <player
            v-for="player in players"
            :key="player.userID"
            :player="player"
          />
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Player from "./Player.vue";
import socket from "../plugins/socketio.js";
import Message from "./Message.vue";

export default {
  name: "Game",
  components: {
    Player,
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
    socket.on("users", (users) => {
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

    socket.on("user connected", (person) => {
      this.players.push(person);
    });

    socket.on("user disconnected", (user) => {
      this.initialisePerson(user);
      this.players.splice(this.players.indexOf(user), 1);
    });

    socket.on("picked letter", (letter) => {
      this.usedLetters.unshift({
        id: Date.now(),
        name: letter,
      });
      this.addMessage("You picked up a letter.");
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
    addMessage(message) {
      this.messages.push({
        message: message,
        localID: Date.now(),
      });
    },
    reset() {
      socket.emit("reset");
    },
    getLetter() {
      socket.emit("get letter");
    },
    undo() {
      socket.emit("undo letter");
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
</style>
