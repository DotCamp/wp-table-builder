<template>
	<control-wrapper :visibility="componentVisibility">
		<range-input
			:label="label"
			:unique-id="uniqueId"
			:elem-container="elemContainer"
			:min="min"
			:max="max"
			:step="step"
			v-model="elementMainValue"
			:post-fix="postFix"
			:clamp="true"
		></range-input>
	</control-wrapper>
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import RangeInput from '../components/RangeInput';
import ControlWrapper from '../components/ControlWrapper';

export default {
	props: {
		min: {
			type: Number,
			default: 1,
			required: false,
		},
		max: {
			type: Number,
			default: 10,
			required: false,
		},
		step: {
			type: Number,
			default: 1,
			required: false,
		},
		defaultValue: {
			type: Number,
			default: 1,
			required: false,
		},
		postFix: {
			type: String,
			default: '',
		},
	},
	mixins: [ControlBase],
	components: { ControlWrapper, RangeInput },
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			const clampedValue = n;

			this.setAllValues(clampedValue);

			// check to see if this update occurs from startup data retrieval, if it is, don't mark table as dirty
			this.generateChangeEvent(clampedValue);

			this.setTableDirty(true);
		},
	},
};
</script>
