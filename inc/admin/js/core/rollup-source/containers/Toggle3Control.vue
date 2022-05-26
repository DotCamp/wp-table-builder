<template>
	<control-wrapper
		:visibility="componentVisibility"
		:compatibility-mode="true"
		:elem-container="elemContainer"
		:unique-id="uniqueId"
		:main-value="elementMainValue"
	>
		<panel-toggle-control v-model="elementMainValue" :label="label"></panel-toggle-control>
	</control-wrapper>
</template>

<script>
import ControlWrapper from '$Components/ControlWrapper';
import ControlBase from '$Mixins/ControlBase';
import ControlBaseBasicImplementation from '$Mixins/ControlBaseBasicImplementation';
import PanelToggleControl from '$Components/PanelToggleControl';

export default {
	mixins: [ControlBase],
	components: { PanelToggleControl, ControlWrapper },
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			if (n === 'true' || n === 'false') {
				this.elementMainValue = n === 'true';
			} else {
				this.basicValueUpdate(n, true);
			}
		},
	},
};
</script>
