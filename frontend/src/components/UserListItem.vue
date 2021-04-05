<template>
	<li>{{ user.username }}<template v-if="user.self"> (you)</template></li>
</template>

<script>
export default {
	name: "UserListItem",
	props: {
		user: Object
	}
}
</script>
