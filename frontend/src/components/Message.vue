<template>
  <li>{{ timestamp }} - <slot></slot></li>
</template>

<script>
export default {
  name: "Message",
  computed: {
    timestamp: function () {
      const date = new Date(Date.now());
      return date.toLocaleTimeString("en-GB");
    },
  },
};
</script>
