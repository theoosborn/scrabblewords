<script setup lang="ts">
import { computed } from "vue";
import Letter from "./Letter.vue";
import type { Message } from "../types";

const props = defineProps<{message: Message}>();

const timestamp = computed(() => {
  return new Date(props.message.time).toLocaleTimeString("en-GB");
});

</script>

<template>
  <li>
    {{ timestamp }} -
    <template v-if="message.letter && message.message === 'picked letter'">
      You picked up
      <letter :char="message.letter"></letter>
    </template>
    <template v-else-if="message.letter && message.message === 'put back letter'">
      You put back
      <letter :char="message.letter"></letter>
    </template>
    <template v-else>
      {{ message.message }}
    </template>
  </li>
</template>

<style scoped>
li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
