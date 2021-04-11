<template>
  <div>
    <table>
      <thead>
        <tr>
          <td v-for="n in showNumber" :key="n">{{ n }}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="n in showNumber" :key="n">
            <letter v-if="letters[n - 1]">{{ letters[n - 1].name }}</letter>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Letter from "./Letter.vue";

export default {
  name: "LetterList",
  props: {
    letters: {
      type: Array,
      required: true,
    },
  },
  components: {
    Letter,
  },
  data: function () {
    return {
      showNumber: 7,
    };
  },
};
</script>
