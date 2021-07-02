<template>
	<div class="wptb-tip-popup wptb-plugin-box-shadow-md" :data-tip-position="position" :title="getMessage">?</div>
</template>

<script>
export default {
	props: {
		position: {
			type: String,
			default: 'topRight',
		},
		message: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		getMessage() {
			return this.disabled ? '' : this.message;
		},
	},
};
</script>
