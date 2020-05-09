<template>
	<div
		class="wptb-settings-section-item"
		:class="{ disabled: !isActive }"
		@click="$emit('sectionchange', name, $event.target)"
		ref="sectionItem"
	>
		{{ name }}
	</div>
</template>
<script>
export default {
	props: ['name', 'current'],
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
	},
};
</script>
