<template>
	<transition name="wptb-fade" mode="out-in">
		<slot v-if="visibility"></slot>
	</transition>
</template>

<script>
export default {
	props: {
		visibility: {
			type: Boolean,
			default: true,
		},
	},
};
</script>
