<template>
	<div class="wptb-responsive-toolbox-wrapper">
		<div class="wptb-responsive-toolbox-top-static wptb-responsive-toolbox-row">
			<responsive-controls-row>
				<input id="wptbResponsiveEnabled" type="checkbox" v-model="directives.responsiveEnabled" />
				<label for="wptbResponsiveEnabled">{{ strings.enableResponsive | cap }}</label>
				<pop-up :message="strings.enableResponsiveHelp">?</pop-up>
			</responsive-controls-row>
			<responsive-controls-row>
				<label for="wptbResponsiveMode">{{ strings.mode | cap }}:</label>
				<select
					v-model="directives.responsiveMode"
					id="wptbResponsiveMode"
					:disabled="!directives.responsiveEnabled"
				>
					<option value="auto">{{ strings.auto | cap }}</option>
				</select>
				<pop-up :message="strings[`${directives.responsiveMode}Help`]">?</pop-up>
			</responsive-controls-row>
			<responsive-controls-row>
				<material-button size="fit-content" :click="showCellIdentifications"
					>{{ strings.identifyCells }}
				</material-button>
			</responsive-controls-row>
<!--			<responsive-controls-row>-->
<!--				<breakpoint-edit></breakpoint-edit>-->
<!--			</responsive-controls-row>-->
		</div>
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
		showCellIdentifications() {
			this.appOptions.identifyCells = true;
		},
	},
};
</script>
