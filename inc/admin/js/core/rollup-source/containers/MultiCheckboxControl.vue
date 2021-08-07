<template>
	<multi-checkbox :checkboxes="checkboxes" v-model="selectedValues" :label="label"></multi-checkbox>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import MultiCheckbox from '../components/MultiCheckbox';

export default {
	props: {
		checkboxes: {
			type: Object,
			default: () => {},
		},
	},
	components: { MultiCheckbox },
	mixins: [ControlBase],
	data() {
		return {
			selectedValues: [],
		};
	},
};
</script>
