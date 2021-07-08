<template>
	<div
		@click.prevent.stop="$emit('directionClick', direction)"
		class="wptb-panel-direction-cadet"
		:data-wptb-panel-direction="direction"
		v-html="icon"
		:data-wptb-active-direction="active"
	></div>
</template>

<script>
export default {
	props: {
		direction: {
			type: String,
			required: true,
		},
		activeDirection: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			icon: '',
		};
	},
	mounted() {
		this.$nextTick(() => {
			WPTB_IconManager.getIcon(`caret-${this.direction}`, null, true).then((icon) => {
				this.icon = icon;
			});
		});
	},
	computed: {
		active() {
			return this.direction === this.activeDirection;
		},
	},
};
</script>
