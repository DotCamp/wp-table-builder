<template>
	<panel-dropdown-control
		:label="label"
		:options="options"
		v-model="elementMainValue"
		:unique-id="uniqueId"
	></panel-dropdown-control>
</template>
<script>
import ControlBase from '$Mixins/ControlBase';
import PanelDropdownControl from '$Components/PanelDropdownControl';
import ControlBaseBasicImplementation from '$Mixins/ControlBaseBasicImplementation';

export default {
	components: { PanelDropdownControl },
	props: {
		options: Object,
	},
	mixins: [ControlBase, ControlBaseBasicImplementation],
};
</script>
