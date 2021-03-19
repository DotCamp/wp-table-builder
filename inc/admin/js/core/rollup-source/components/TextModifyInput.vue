<template>
	<div class="wptb-text-modify-input" :data-wptb-text-modify-disable="disabled">
		<input
			ref="inputElementRef"
			:value="value"
			@input="$emit('update:value', $event.target.value)"
			class="wptb-text-modify-custom-input"
			:disabled="disabled"
			:style="inputStyle"
			@focusout="handleBlur"
			@focusin="handleFocus"
			@focus="handleFocus"
			@keydown.prevent.enter="disabled = true"
			@keydown.prevent.esc="disabled = true"
		/>
		<span @click="enableEdit" class="wptb-text-modify-edit-button">
			<span class="dashicons dashicons-edit"></span>
		</span>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			disabled: true,
		};
	},
	computed: {
		inputStyle() {
			return {
				width: `${this.value.length}ch !important`,
				textDecoration: this.disabled ? '' : 'underline !important',
			};
		},
	},
	methods: {
		enableEdit() {
			if (this.disabled) {
				this.disabled = false;
			}
		},
		handleFocus(e) {
			e.target.select();
		},
		handleBlur() {
			this.disabled = true;
		},
	},
};
</script>
