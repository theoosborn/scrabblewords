<template>
    <div>
        <label>Please enter your username: 
            <input v-model="username" type="text" id="name" required>
        </label>
        <small v-if="error" class="error">{{ error.message }}</small>
        <button :disabled="!isValid" @click="submit()">Login</button>
    </div>
</template>

<script>
export default {
    name: "SelectUsername",
    data () {
        return {
            username: ""
        }
    },
    props: {
        error: Error
    },
    methods: {
        submit() {
            this.$emit("submit", this.username);
        }
    },
    computed: {
        isValid() {
            return this.username.length > 0;
        }
    }
}
</script>

<style scoped>
    p.error {
        color: red;
    }
</style>
