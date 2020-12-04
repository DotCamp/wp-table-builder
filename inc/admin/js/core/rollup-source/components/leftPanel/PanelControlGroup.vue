<template>
	<div class="wptb-panel-control-group">
		<div class="wptb-panel-control-group-title">{{ title | cap }}</div>
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: 'Control Group',
		},
	},
};
</script>
