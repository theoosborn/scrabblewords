<template>
    <div>
        <label>Please enter your username: 
            <input v-model="username" type="text" id="name" required>
        </label>
        <button>Login</button>
    </div>
</template>

<script>
    export default {
        name: "UserLogin",
        data () {
            return {
                username: ""
            }
        },
        methods: {
            login: function () {
                this.$emit('loginRequest', this.username)
            }
        }
    }
</script>