<template>
    <div>
        <UserLogin v-if="!isLoggedIn" v-on:login-request="sendEvent()" />
        <li v-for="message in serverOutput" v-bind:key="message.received">{{ message }}</li>
    </div>
</template>

<script>
    import * as socketio from '../plugins/socketio';
    import UserLogin from './UserLogin.vue'

    export default {
        name: 'ScrabbleGame',
        components: {
            UserLogin
        },
        data () {
            return {
                isLoggedIn: false,
                serverOutput: []
            }
        },
        methods: {
            sendMessage(text) {
                socketio.sendEvent({
                    type: 'message',
                    data: {
                        message: text,
                        sent: Date.now()
                    }
                })
            }
        },
        mounted () {
            socketio.addEventListener({
                type: 'message',
                callback: (message) => {
                    message.received = Date.now();
                    this.serverOutput.push(message);
                }
            })
        }
    }
</script>
