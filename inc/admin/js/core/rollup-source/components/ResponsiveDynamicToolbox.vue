<template>
	<div v-if="isVisible" class="wptb-responsive-toolbox-dynamic-wrapper">
		<div class="wptb-controls-flex-row wptb-responsive-size-range-name">
			{{ rangeName.name | cap }}
		</div>
		<div class="wptb-responsive-toolbox-dynamic-controls-holder">
			<slot v-bind:context="parentContext" v-bind:directives="directives"></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		visible: Boolean,
		mode: {
			type: String,
			required: true,
		},
		rangeName: Object,
	},
	computed: {
		isVisible() {
			return this.directives.responsiveMode === this.mode;
		},
		// pass parent context to slot scope
		parentContext() {
			return this;
		},
	},
	methods: {
		isDisabled() {
			return this.rangeName.id === 'desktop' || !this.directives.responsiveEnabled;
		},
	},
};
</script>
