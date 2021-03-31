<template>
	<div class="wptb-window-header-button" :title="title" :data-active="active">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
		active: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
