<template>
	<panel-dropdown-control
		:label="label"
		:options="options"
		v-model="elementMainValue"
		:unique-id="uniqueId"
	></panel-dropdown-control>
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import PanelDropdownControl from '../components/PanelDropdownControl';

export default {
	components: { PanelDropdownControl },
	props: {
		options: Object,
	},
	mixins: [ControlBase],
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			this.generateChangeEvent(n);
			this.setAllValues(n);

			this.setTableDirty(true);
		},
	},
};
</script>
