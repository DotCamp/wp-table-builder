<template>
	<div>
		<slot v-if="isActive"></slot>
	</div>
</template>

<script>
export default {
	props: {
		activeId: {
			type: String,
			default: 'default',
		},
		id: {
			type: String,
			default: 'default',
		},
	},
	computed: {
		isActive() {
			return this.id === this.activeId;
		},
	},
};
</script>
