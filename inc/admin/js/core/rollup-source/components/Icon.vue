<template>
	<div v-html="iconFragment"></div>
</template>

<script>
const defaultClasses = ['wptb-svg-inherit-color'];

export default {
	props: {
		name: {
			type: String,
			default: '',
		},
		extraClasses: {
			type: Array,
			default: () => {
				return defaultClasses;
			},
		},
	},
	watch: {
		extraClasses() {
			this.prepareClasses();
			this.prepareIcon();
		},
		name() {
			this.prepareIcon();
		},
	},
	data() {
		return {
			iconFragment: '',
			innerExtraClasses: [],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.prepareClasses(this.extraClasses);
			this.prepareIcon();
		});
	},
	methods: {
		prepareIcon() {
			WPTB_IconManager.getIcon(this.name, this.innerExtraClasses, true).then((icon) => {
				this.iconFragment = icon;
			});
		},
		prepareClasses() {
			this.innerExtraClasses = Array.from(new Set([...this.extraClasses, ...defaultClasses]));
		},
	},
};
</script>
