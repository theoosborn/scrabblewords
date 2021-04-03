<template>
    <div>
        <label>Please enter your username: 
            <input v-model="username" type="text" id="name" required>
        </label>
        <p v-if="error" class="error">{{ error }}</p>
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
            error: String
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
