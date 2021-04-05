<template>
	<li>{{ player.username }}<template v-if="player.self"> (you)</template></li>
</template>

<script>
export default {
	name: "Player",
	props: {
		player: Object
	}
}
</script>
