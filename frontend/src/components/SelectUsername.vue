<template>
  <div class="flex flex-col max-w-md gap-4 mt-40 mx-auto items-center">
    <label for="name">Please enter your nickname:</label>
    <input v-model="name" type="text" id="name" class="border-2 border-black rounded-lg p-2" required
      v-on:keyup.enter="submit()" autocomplete="off">
    <button
      class="button w-20 bg-green-800 text-gray-100"
      :disabled="!isValid" @click="submit()">Play</button>
    <Transition>
      <p v-if="error" class="text-red-500">{{ error.message }}</p>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'SelectUsername',
  data() {
    return {
      name: ''
    };
  },
  props: {
    error: Error
  },
  methods: {
    submit() {
      if (this.isValid) {
        this.$emit('submit', this.name);
      }
    }
  },
  computed: {
    isValid() {
      return this.name.length > 0;
    }
  }
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition ease-in-out duration-300;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
