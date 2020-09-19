<template>
	<div
		class="wptb-settings-section-item"
		:class="{ disabled: !isActive }"
		@click="$emit('sectionchange', name, $event.target)"
		ref="sectionItem"
	>
		{{ getLabel }}
	</div>
</template>
<script>
export default {
	props: ['name', 'current', 'label'],
	methods: {
		activePosition() {
			if (this.current === undefined || this.current === this.name) {
				this.$emit('activeSectionElement', this.$refs.sectionItem);
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
