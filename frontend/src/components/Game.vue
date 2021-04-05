<template>
	<div>
		<h2>users</h2>
		<ul>
			<user-list-item v-for="user in users" v-bind:key="user.userID" :user="user" />
		</ul>
	</div>
</template>

<script>
import UserListItem from "./UserListItem.vue"
import socket from "../plugins/socketio.js";

export default {
	name: "Game",
	components: {
		UserListItem
	},
	data() {
		return {
			users: []
		}
	},
	created() {
		socket.on("users", (users) => {
			users.forEach((user) => {
				user.self = user.userID === socket.id;
			})
			// Puts the current user first and sorts by username.
			this.users = users.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			})
		});

		socket.on("user connected", (user) => {
			console.log("user connected")
			this.users.push(user);
		});
	}
}
</script>
