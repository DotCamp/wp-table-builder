<template>
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
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import RangeInput from '../components/RangeInput';

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
	components: { RangeInput },
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			this.basicValueUpdate(n, true);
		},
	},
};
</script>
