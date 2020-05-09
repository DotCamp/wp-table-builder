<!--Menu button component-->
<template>
	<div class="wptb-settings-button" :class="[{ disabled: disabled }, type, size]" @click="handleClick">
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: {
		disabled: Boolean,
		type: {
			type: String,
			default: 'primary',
		},
		size: {
			type: String,
			default: 'normal',
		},
	},
	methods: {
		/**
		 * Click event callback
		 */
		handleClick() {
			if (!this.disabled) {
				this.$emit('click');
			}
		},
	},
};
</script>
