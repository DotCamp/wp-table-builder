<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<label class="wptb-toggle">
				<span style="font-size: 16px;">
					{{ label }}
				</span>
				<input class="wptb-element-property" type="checkbox" v-model="innerValue" :disabled="disabled" />
				<i></i>
			</label>
		</div>
	</div>
</template>
<script>
import PanelControlBase from '../mixins/PanelControlBase';

export default {
	mixins: [PanelControlBase],
};
</script>
