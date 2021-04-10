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
			:placeholder="placeholder"
		/>
		<span @click="enableEdit" class="wptb-text-modify-edit-button" :style="editButtonStyle">
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
		editAlwaysVisible: {
			type: Boolean,
			default: false,
		},
		placeholder: {
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
				width: `${this.value.length === 0 ? this.placeholder.length : this.value.length}ch !important`,
				textDecoration: this.disabled ? '' : 'underline !important',
			};
		},
		editButtonStyle() {
			return {
				visibility: `${this.editAlwaysVisible ? 'visible' : 'collapse'}`,
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
