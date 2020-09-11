<template>
	<div class="wptb-settings-controls-wrapper" :class="[center ? 'center' : 'grid']">
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: {
		center: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
