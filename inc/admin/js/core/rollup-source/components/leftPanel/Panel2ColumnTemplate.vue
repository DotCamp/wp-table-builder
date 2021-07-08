<template>
	<div
		:data-wptb-disabled="disabled"
		v-bind="$attrs"
		class="wptb-element-option wptb-settings-items wptb-plugin-width-full wptb-element-property"
	>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<div class="wptb-settings-space-between">
				<p :data-wptb-text-disabled="disabled" class="wptb-settings-item-title wptb-text-transform-cap">
					{{ label }}
				</p>
				<div>
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: 'panel control label',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
