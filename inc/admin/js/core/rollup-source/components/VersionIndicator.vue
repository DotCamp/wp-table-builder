<template>
	<div class="wptb-version-indicator">
		<div class="wptb-version-indicator-circle" :class="indicatorStyle"></div>
		<div class="wptb-version-indicator-version">{{ version }}</div>
	</div>
</template>

<script>
export default {
	props: {
		latestVersion: {
			type: String,
			default: '1.0.0',
		},
		version: {
			type: String,
			default: '1.0.0',
		},
	},
	computed: {
		indicatorStyle() {
			return {
				'wptb-version-indicator-match': this.latestVersion === this.version,
				'wptb-version-indicator-low': this.latestVersion !== this.version,
			};
		},
	},
};
</script>
