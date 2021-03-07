<template>
  <div id="app">
    <header class="header">
        <h1>crabble</h1>
    </header>
    <ScrabbleGame />
  </div>
</template>

<script>
import ScrabbleGame from './components/ScrabbleGame.vue'

export default {
  name: 'App',
  components: {
    ScrabbleGame
  },
  data: function() {
    return {
      test: true
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
