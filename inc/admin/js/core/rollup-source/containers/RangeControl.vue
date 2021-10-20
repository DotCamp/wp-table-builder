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
import ControlBase from '$Mixins/ControlBase';
import RangeInput from '$Components/RangeInput';
import ControlWrapper from '$Components/ControlWrapper';
import ControlBaseBasicImplementation from '$Mixins/ControlBaseBasicImplementation';

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
	mixins: [ControlBase, ControlBaseBasicImplementation],
	components: { ControlWrapper, RangeInput },
};
</script>
