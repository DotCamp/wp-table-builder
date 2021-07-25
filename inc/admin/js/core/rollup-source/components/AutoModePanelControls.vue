<template>
	<fragment>
		<div v-if="appOptions.currentBreakpoint !== 'desktop'">
			<panel-toggle-control
				v-if="appOptions.isPro"
				v-model="directives.modeOptions.auto.disabled[appOptions.currentBreakpoint]"
				:label="strings.disableBreakpoint | cap"
				:disabled="isDisabledMaster()"
			>
			</panel-toggle-control>
			<disabled-overlay-container v-else :overlay-visibility="true">
				<panel-toggle-control v-model="dummyData" :label="strings.disableBreakpoint | cap" :disabled="true">
				</panel-toggle-control>
			</disabled-overlay-container>
		</div>
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
		<transition name="wptb-fade">
			<panel-toggle-control
				v-show="
					directives.modeOptions.auto.topRowAsHeader[appOptions.currentBreakpoint] &&
					directives.modeOptions.auto.cellStackDirection[appOptions.currentBreakpoint] === 'row' &&
					appOptions.headerFullyMerged
				"
				v-model="directives.modeOptions.auto.repeatMergedHeader[appOptions.currentBreakpoint]"
				:label="strings.repeatMergedHeader | cap"
				:disabled="isDisabled()"
			>
			</panel-toggle-control>
		</transition>
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
import PanelToggleControl from '$Components/PanelToggleControl';
import PanelDropdownControl from '$Components/PanelDropdownControl';
import PanelInputControl from '$Components/PanelInputControl';
import DisabledOverlayContainer from '$Components/DisabledOverlayContainer';

export default {
	data() {
		return {
			dummyData: false,
		};
	},
	components: { DisabledOverlayContainer, Fragment, PanelToggleControl, PanelDropdownControl, PanelInputControl },
	methods: {
		isDisabled() {
			return (
				this.isDisabledMaster() || this.directives.modeOptions.auto.disabled[this.appOptions.currentBreakpoint]
			);
		},
		isDisabledMaster() {
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
