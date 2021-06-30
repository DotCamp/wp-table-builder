<template>
	<div class="wptb-tip-popup wptb-plugin-box-shadow-md" :data-tip-position="position" :title="message">?</div>
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
	},
};
</script>
