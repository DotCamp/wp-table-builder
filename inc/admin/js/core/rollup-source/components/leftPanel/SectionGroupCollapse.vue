<template>
	<div class="wptb-panel-toggle-group" ref="toggleWrapper" :id="sectionId">
		<div class="wptb-panel-toggle" @click.prevent="handleToggle">
			<div class="header">{{ label }}</div>
			<span class="dashicons toggle-icon" @click.prevent.capture.stop="handleToggle"></span>
		</div>
		<div class="wptb-panel-section-toggle-target" ref="toggleTarget">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SectionGroupCollapse',
	props: {
		sectionId: {
			type: String,
			default: 'sectionGroupCollapse',
		},
		label: {
			type: String,
			default: 'Section group collapse',
		},
		startCollapsed: {
			types: Boolean,
			default: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			if (this.startCollapsed) {
				this.handleToggle();
			}
		});
	},
	methods: {
		handleToggle() {
			const $ = jQuery;
			this.$refs.toggleWrapper.classList.toggle('wptb-panel-toggle-content');
			$(this.$refs.toggleTarget).slideToggle();
		},
	},
};
</script>
