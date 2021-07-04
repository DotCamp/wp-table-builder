<template>
	<div class="wptb-lazy-load-preview" v-html="previewHtml"></div>
</template>

<script>
export default {
	props: {
		defaultHtml: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			previewHtml: '',
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.previewHtml = this.defaultHtml;
		});
	},
};
</script>
