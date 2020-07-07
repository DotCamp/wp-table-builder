<template>
	<div class="wptb-responsive-toolbox-wrapper">
		<component :is="dynamicToolbox" :size-range="sizeRange"></component>
	</div>
</template>
<script>
import PopUp from './PopUp';
import ResponsiveDynamicToolbox from './ResponsiveDynamicToolbox';
import AutoToolbox from './AutoToolbox';
import MaterialButton from './MaterialButton';
import BreakpointEdit from './BreakpointEdit';

export default {
	props: {
		sizeRange: Object,
	},
	components: { PopUp, ResponsiveDynamicToolbox, AutoToolbox, MaterialButton, BreakpointEdit },
	computed: {
		dynamicToolbox() {
			const currentMode = this.directives.responsiveMode;

			return `${currentMode[0].toUpperCase() + currentMode.slice(1)}Toolbox`;
		},
	},
	methods: {
		isCurrentMode(mode) {
			return this.directives.responsiveMode === mode;
		},
	},
};
</script>
