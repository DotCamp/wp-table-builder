<template>
	<control-wrapper>
		<multi-checkbox :checkboxes="checkboxes" v-model="selectedValues" :label="label"></multi-checkbox>
	</control-wrapper>
</template>

<script>
import ControlBase from '$Mixins/ControlBase';
import MultiCheckbox from '$Components/MultiCheckbox';
import ControlWrapper from '$Components/ControlWrapper';

export default {
	props: {
		checkboxes: {
			type: Object,
			default: () => {},
		},
	},
	components: { ControlWrapper, MultiCheckbox },
	mixins: [ControlBase],
	data() {
		return {
			selectedValues: [],
		};
	},
};
</script>
