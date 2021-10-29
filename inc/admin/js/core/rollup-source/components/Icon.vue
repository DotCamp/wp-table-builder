<template>
	<div v-html="iconFragment"></div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: '',
		},
		extraClasses: {
			type: Array,
			default: () => {
				return ['wptb-svg-inherit-color'];
			},
		},
	},
	watch: {
		name(n) {
			WPTB_IconManager.getIcon(n, this.extraClasses, true).then((icon) => {
				this.iconFragment = icon;
			});
		},
	},
	data() {
		return {
			iconFragment: '',
		};
	},
	mounted() {
		WPTB_IconManager.getIcon(this.name, this.extraClasses, true).then((icon) => {
			this.iconFragment = icon;
		});
	},
};
</script>
