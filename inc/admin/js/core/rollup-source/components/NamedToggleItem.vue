<template>
	<div
		ref="itemWrapper"
		class="wptb-named-toggle-item"
		@click.prevent.capture="activateItem"
		:data-wptb-named-toggle-active="active"
	>
		{{ title }}
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: 'item',
		},
		id: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		active(n) {
			if (n === true) {
				this.$emit('activateItem', this.id, this.$refs.itemWrapper);
			}
		},
	},
	methods: {
		activateItem(e) {
			this.$emit('activateItem', this.id, e.target);
		},
	},
};
</script>
