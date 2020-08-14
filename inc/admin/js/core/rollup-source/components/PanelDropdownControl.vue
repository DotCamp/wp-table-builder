<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<label
				class="wptb-control-row wptb-flex wptb-flex-row wptb-flex-align-center wptb-flex-justify-space-between"
			>
				<span style="font-size: 16px;">
					{{ label }}
				</span>
				<select :disabled="disabled" v-model="innerValue">
					<option v-for="(name, key) in options" :key="key" :value="key">{{ name | cap }}</option>
				</select>
			</label>
		</div>
	</div>
</template>
<script>
import PanelControlBase from '../mixins/PanelControlBase';

export default {
	props: {
		options: {
			type: Object,
			default: () => {},
		},
	},
	mixins: [PanelControlBase],
};
</script>
