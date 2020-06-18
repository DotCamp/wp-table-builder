<template>
	<div class="wptb-responsive-toolbox-dynamic-wrapper">
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
		// pass parent context to slot scope, this way any element added as child can call methods and access properties of this parent component
		parentContext() {
			return this;
		},
	},
	methods: {
		/**
		 * Decide whether control is disabled or not.
		 *
		 * Currently, as default, disabled state of controls are calculated according to if screen size fits in the range of 'desktop' or responsive mode is activated.
		 *
		 * @return {boolean} control is disabled or not
		 */
		isDisabled() {
			return this.rangeName.id === 'desktop' || !this.directives.responsiveEnabled;
		},
	},
};
</script>
