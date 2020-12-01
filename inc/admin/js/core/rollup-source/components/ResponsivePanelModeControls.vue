<!--
Left panel mode options controls component.
-->
<template>
	<panel-section-group-tabbed
		@tabClicked="handleTabChange"
		:current-tab="appOptions.currentBreakpoint"
		:tabs="breakpointsObject"
		:header="strings[directives.responsiveMode]"
	>
		<!--component that will be mounted here should follow the naming convention of '${ModeName}ModePanelControls'-->
		<component :is="currentPanelControls"></component>
	</panel-section-group-tabbed>
</template>
<script>
import PanelSectionGroupTabbed from './PanelSectionGroupTabbed';
import AutoModePanelControls from './AutoModePanelControls';

export default {
	components: { PanelSectionGroupTabbed, AutoModePanelControls },
	mounted() {
		this.$nextTick(() => {
			// start responsive builder with provided default breakpoint
			this.handleTabChange(this.appOptions.currentBreakpoint);
		});
	},
	computed: {
		breakpointsObject() {
			return Object.keys(this.directives.breakpoints)
				.sort((a, b) => {
					// sort breakpoints by their width ascending
					return this.directives.breakpoints[a].width - this.directives.breakpoints[b].width;
				})
				.reduce((c, k) => {
					if (Object.prototype.hasOwnProperty.call(this.directives.breakpoints, k)) {
						// eslint-disable-next-line no-param-reassign
						c[k] = this.directives.breakpoints[k].name;
					}
					return c;
				}, {});
		},
		currentPanelControls() {
			return `${
				this.directives.responsiveMode[0].toUpperCase() + this.directives.responsiveMode.slice(1)
			}ModePanelControls`;
		},
	},
	methods: {
		/**
		 * Handle tab change
		 *
		 * @param {string} tabId breakpoint id
		 */
		handleTabChange(tabId) {
			// assign tabId to breakpoint id property of global store
			this.appOptions.currentBreakpoint = tabId;

			// get breakpoint size and assign to size property of global store to force a rebuilding process
			this.appOptions.currentSize = this.directives.breakpoints[tabId].width;
		},
	},
};
</script>
