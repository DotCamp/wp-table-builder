<template>
	<fragment>
		<panel-toggle-control
			v-model="directives.responsiveEnabled"
			:label="strings.enableResponsive | cap"
		></panel-toggle-control>
		<panel-dropdown-control
			:label="strings.relative | cap"
			v-model="directives.relativeWidth"
			:options="{ window: strings.window, container: strings.container }"
			:disabled="!directives.responsiveEnabled"
		>
		</panel-dropdown-control>
		<panel-dropdown-control
			:label="strings.mode | cap"
			v-model="directives.responsiveMode"
			:options="{ auto: 'auto' }"
			:disabled="!directives.responsiveEnabled"
		></panel-dropdown-control>
	</fragment>
</template>
<script>
import { Fragment } from 'vue-fragment';
import PanelToggleControl from './PanelToggleControl';
import PanelDropdownControl from './PanelDropdownControl';

export default {
	components: { PanelToggleControl, PanelDropdownControl, Fragment },
};
</script>
