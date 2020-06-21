<template>
	<div class="wptb-responsive-toolbox-wrapper">
		<div class="wptb-responsive-toolbox-top-static wptb-responsive-toolbox-row">
			<div class="wptb-controls-flex-row">
				<input id="wptbResponsiveEnabled" type="checkbox" v-model="directives.responsiveEnabled" />
				<label for="wptbResponsiveEnabled">{{ strings.enableResponsive | cap }}</label>
				<pop-up :message="strings.enableResponsiveHelp">?</pop-up>
			</div>
			<div class="wptb-controls-flex-row">
				<label for="wptbResponsiveMode">{{ strings.mode | cap }}:</label>
				<select
					v-model="directives.responsiveMode"
					id="wptbResponsiveMode"
					:disabled="!directives.responsiveEnabled"
				>
					<option value="auto">{{ strings.auto | cap }}</option>
				</select>
				<pop-up :message="strings[`${directives.responsiveMode}Help`]">?</pop-up>
			</div>
			<div class="wptb-controls-flex-row wptb-responsive-identify-cells-wrapper">
				<material-button size="fit-content" :click="showCellIdentifications">{{ strings.identifyCells }}</material-button>
			</div>
		</div>
		<component :is="dynamicToolbox" :size-range="sizeRange"></component>
	</div>
</template>
<script>
import PopUp from './PopUp';
import ResponsiveDynamicToolbox from './ResponsiveDynamicToolbox';
import AutoToolbox from './AutoToolbox';
import MaterialButton from './MaterialButton';

export default {
	props: {
		sizeRange: Object,
	},
	components: { PopUp, ResponsiveDynamicToolbox, AutoToolbox, MaterialButton },
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
