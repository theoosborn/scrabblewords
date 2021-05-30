<template>
  <span class="letter"><slot></slot></span>
</template>

<script>
export default {
  name: "Letter",
};
</script>

<style scoped>
span.letter {
  border-width: 0.1em;
  border-color: #000000;
  border-style: solid;
  width: 1.5em;
  height: 1.5em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.1em;
}
</style>
