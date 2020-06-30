<template>
	<div class="wptb-section-group-tabbed wptb-plugin-box-shadow-md wptb-plugin-width-full">
		<div class="wptb-panel-toggle wptb-section-group-tabbed-header">
			<div class="header">{{ header }}</div>
		</div>
		<div class="wptb-section-group-tabbed-tabs-buttons">
			<div class="wptb-settings-section-item static-active active">mobile</div>
			<div class="wptb-settings-section-item static-active disabled">tablet</div>
			<div class="wptb-settings-section-item static-active disabled">desktop</div>
		</div>
		<div class="wptb-section-group-tab-content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		header: {
			type: String,
			default: 'Tab Header',
		},
		sections: {
			type: Object,
			default: () => {},
		},
	},
};
</script>
