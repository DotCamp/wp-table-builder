<template>
	<div class="wptb-panel-control-group">
		<div class="wptb-panel-control-group-title">
			<div v-if="icon !== ''" v-html="icon" class="wptb-data-panel-control-group-icon"></div>
			<span class="wptb-data-panel-control-group-title-text">
				{{ title | cap }}
			</span>
		</div>
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
		icon: {
			type: String,
			default: '',
		},
	},
};
</script>
