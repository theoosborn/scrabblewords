<template>
  <li>
    {{ timestamp }} -
    <template v-if="message.message === 'picked letter'">
      You picked up
      <letter>{{ message.letter }}</letter>
    </template>
    <template v-else-if="message.message === 'undid letter'">
      You put back
      <letter>{{ message.letter }}</letter>
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
