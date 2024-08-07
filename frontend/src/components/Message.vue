<template>
  <li>
    {{ timestamp }} -
    <template v-if="message.message === 'picked letter'">
      You picked up
      <letter :char="message.letter"></letter>
    </template>
    <template v-else-if="message.message === 'put back letter'">
      You put back
      <letter :char="message.letter"></letter>
    </template>
    <template v-else>
      {{ message.message }}
    </template>
  </li>
</template>

<script>
import Letter from "./Letter.vue";

export default {
  name: "Message",
  components: { Letter },
  props: {
    message: {
      type: Object,
    }
  },
  computed: {
    timestamp: function () {
      return new Date(this.message.time).toLocaleTimeString("en-GB");
    },
  },
};
</script>

<style scoped>
li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
