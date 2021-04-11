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
  border: 2px;
  border-color: #000000;
  border-style: solid;
  text-align: center;
  width: 30px;
  height: 30px;
  display: inline-block;
  margin: 0 5px;
}
</style>
