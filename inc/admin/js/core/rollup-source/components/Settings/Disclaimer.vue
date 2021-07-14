<template>
	<div class="wptb-disclaimer-container">
		<div class="wptb-disclaimer-title">{{ title }}:</div>
		<div class="wptb-disclaimer-message" v-html="messageHtml"></div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: 'title',
		},
		message: {
			type: String,
			default: 'message',
		},
	},
	computed: {
		messageHtml() {
			return `<p>${this.message}</p>`;
		},
	},
};
</script>
