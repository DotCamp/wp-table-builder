<template>
	<control-wrapper
		:compatibility-mode="true"
		:visibility="componentVisibility"
		:elem-container="elemContainer"
		:main-value="elementMainValue"
		:unique-id="uniqueId"
	>
		<color-picker :label="label" v-model="elementMainValue"></color-picker>
	</control-wrapper>
</template>
<script>
import ControlBase from '$Mixins/ControlBase';
import ControlWrapper from '$Components/ControlWrapper';
import ColorPicker from '$Components/ColorPicker';
import ControlBaseBasicImplementation from '$Mixins/ControlBaseBasicImplementation';

export default {
	mixins: [ControlBase, ControlBaseBasicImplementation],
	components: { ColorPicker, ControlWrapper },
};
</script>
