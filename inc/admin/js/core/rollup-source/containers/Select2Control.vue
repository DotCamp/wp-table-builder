<template>
	<div class="wptb-settings-row wptb-settings-middle-xs">
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title">{{ label }}</p>
			<div>
				<select
					v-model="elementMainValue"
					class="wptb-element-property"
					:class="uniqueId"
					:data-element="elemContainer"
					data-type="select2"
					ref="selectElement"
				>
					<option v-for="(value, key) in options" :value="key" :key="key">{{ value }}</option>
				</select>
			</div>
		</div>
	</div>
</template>
<script>
import ControlBase from '../mixins/ControlBase';

export default {
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
