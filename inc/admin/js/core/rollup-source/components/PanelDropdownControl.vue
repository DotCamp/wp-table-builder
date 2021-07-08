<template>
	<panel2-column-template :disabled="disabled" :label="label"
		><select :disabled="disabled" v-model="innerValue">
			<option v-for="(name, key) in options" :key="key" :value="key">{{ name | cap }}</option>
		</select></panel2-column-template
	>
</template>
<script>
import PanelControlBase from '$Mixins/PanelControlBase';
import Panel2ColumnTemplate from '$LeftPanel/Panel2ColumnTemplate';

export default {
	components: { Panel2ColumnTemplate },
	props: {
		options: {
			type: Object,
			default: () => {},
		},
	},
	mixins: [PanelControlBase],
};
</script>
