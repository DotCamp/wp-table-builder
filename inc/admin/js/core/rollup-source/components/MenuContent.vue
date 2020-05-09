<template>
	<div class="wptb-settings-controls-wrapper" :class="[center ? 'center' : 'grid']">
		<transition name="wptb-fade" mode="out-in">
			<slot></slot>
		</transition>
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
