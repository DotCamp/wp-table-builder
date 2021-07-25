<template>
	<div class="wptb-disabled-overlay-container">
		<div class="wptb-disabled-overlay-slot-wrapper">
			<slot></slot>
		</div>
		<div v-if="overlayVisibility" class="wptb-disabled-overlay"></div>
	</div>
</template>

<script>
export default {
	props: {
		overlayVisibility: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
