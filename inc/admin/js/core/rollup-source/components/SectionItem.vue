<template>
	<div
		class="wptb-settings-section-item"
		:class="{ disabled: disabled || !isActive }"
		@click="activateSection($event)"
		ref="sectionItem"
	>
		{{ getLabel }}
	</div>
</template>
<script>
export default {
	props: {
		name: {
			type: String,
			default: 'section_item',
		},
		current: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: 'Section Item',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		activePosition() {
			if (this.current === undefined || this.current === this.name) {
				this.$emit('activeSectionElement', this.$refs.sectionItem);
			}
		},
		activateSection(e) {
			if (!this.disabled) {
				this.$emit('sectionchange', this.name, e.target);
			}
		},
	},
	computed: {
		isActive() {
			this.activePosition();
			if (this.current !== undefined) {
				return this.current === this.name;
			}
			return true;
		},
		getLabel() {
			return this.label !== undefined ? this.label : this.name;
		},
	},
};
</script>
