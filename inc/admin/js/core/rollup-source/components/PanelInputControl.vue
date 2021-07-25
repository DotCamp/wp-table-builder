<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full" :data-wptb-text-disabled="disabled">
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<label
				class="wptb-control-row wptb-flex wptb-flex-row wptb-flex-align-center wptb-flex-justify-space-between"
			>
				<span style="font-size: 16px;">
					{{ label }}
				</span>
				<number-postfix-input
					class="wptb-size-input"
					:enable-dynamic-width="true"
					v-model="innerValue"
					:min="1"
					:max="100"
					:enable-limit="true"
					:disabled="disabled"
				></number-postfix-input>
			</label>
		</div>
	</div>
</template>
<script>
import PanelControlBase from '../mixins/PanelControlBase';
import NumberPostfixInput from './NumberPostfixInput';

export default {
	components: { NumberPostfixInput },
	mixins: [PanelControlBase],
};
</script>
