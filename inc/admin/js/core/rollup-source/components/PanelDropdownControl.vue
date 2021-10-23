<template>
	<panel2-column-template :disabled="disabled" :label="label">
		<select :disabled="disabled" v-model="innerValue" class="wptb-element-property" :class="uniqueId">
			<option v-for="(name, key) in options" :key="key" :value="key">{{ name | cap }}</option>
		</select>
	</panel2-column-template>
</template>
<script>
import PanelControlBase from '$Mixins/PanelControlBase';
import Panel2ColumnTemplate from '$LeftPanel/Panel2ColumnTemplate';
import { cap } from '$Plugins/filters';

export default {
	components: { Panel2ColumnTemplate },
	props: {
		options: {
			type: Object,
			default: () => {},
		},
	},
	mixins: [PanelControlBase],
	filters: {
		cap,
	},
};
</script>
