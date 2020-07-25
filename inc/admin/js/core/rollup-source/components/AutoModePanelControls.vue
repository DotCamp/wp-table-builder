<template>
	<fragment>
		<panel-toggle-control
			v-model="directives.modeOptions.auto.topRowAsHeader[appOptions.currentBreakpoint]"
			:label="strings.topRowHeader | cap"
			:disabled="isDisabled()"
			:depends-value="directives.modeOptions.auto.staticTopRow[appOptions.currentBreakpoint]"
			:depends-callback="
				(d, c) => {
					if (d === true) {
						return false;
					}
					return c;
				}
			"
		>
		</panel-toggle-control>
		<panel-toggle-control
			v-model="directives.modeOptions.auto.staticTopRow[appOptions.currentBreakpoint]"
			:label="strings.staticTopRow | cap"
			:disabled="isDisabled()"
			:depends-value="directives.modeOptions.auto.topRowAsHeader[appOptions.currentBreakpoint]"
			:depends-callback="
				(d, c) => {
					if (d === true) {
						return false;
					}
					return c;
				}
			"
		>
		</panel-toggle-control>
		<panel-dropdown-control
			:label="strings.stackDirection | cap"
			v-model="directives.modeOptions.auto.cellStackDirection[appOptions.currentBreakpoint]"
			:options="{ row: strings.row, column: strings.column }"
			:disabled="isDisabled()"
		></panel-dropdown-control>
		<panel-input-control
			v-model="directives.modeOptions.auto.cellsPerRow[appOptions.currentBreakpoint]"
			:label="perLabelString | cap"
			:disabled="isDisabled()"
		></panel-input-control>
	</fragment>
</template>
<script>
import { Fragment } from 'vue-fragment';
import PanelToggleControl from './PanelToggleControl';
import PanelDropdownControl from './PanelDropdownControl';
import PanelInputControl from './PanelInputControl';

export default {
	components: { Fragment, PanelToggleControl, PanelDropdownControl, PanelInputControl },
	methods: {
		isDisabled() {
			return this.appOptions.currentBreakpoint === 'desktop' || !this.directives.responsiveEnabled;
		},
	},
	computed: {
		perLabelString() {
			return this.directives.modeOptions.auto.topRowAsHeader[this.appOptions.currentBreakpoint]
				? this.strings.itemsPerHeader
				: this.strings.cellsPerRow;
		},
	},
};
</script>
