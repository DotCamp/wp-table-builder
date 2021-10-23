<template>
	<control-wrapper :visibility="componentVisibility">
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
			assignDefaultValueAtMount: true,
		};
	},
	watch: {
		selectedValues: {
			handler(n) {
				this.elementMainValue = n.join(' ');
			},
			deep: true,
		},
		elementMainValue(val) {
			if (val) {
				this.selectedValues = val.trim === '' ? [] : val.split(' ');

				this.basicValueUpdate(val, true);
			}
		},
	},
};
</script>
