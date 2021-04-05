<template>
    <div>
        <label>Please enter your username: 
            <input v-model="name" type="text" id="name" required>
        </label>
        <button :disabled="!isValid" @click="submit()">Login</button>
        <p v-if="error" class="error">{{ error.message }}</p>
    </div>
</template>

<script>
export default {
    name: "SelectUsername",
    data () {
        return {
            name: ""
        }
    },
    props: {
        error: Error
    },
    methods: {
        submit() {
            this.$emit("submit", this.name);
        }
    },
    computed: {
        isValid() {
            return this.name.length > 0;
        }
    }
}
</script>

<style scoped>
    p.error {
        color: red;
    }
</style>
