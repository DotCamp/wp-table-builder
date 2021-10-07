<template>
	<div class="wptb-size2-control-input-component">
		<div class="wptb-size2-input-header wptb-unselectable">{{ title | cap }}</div>
		<div class="wptb-size2-input">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
	},
};
</script>
