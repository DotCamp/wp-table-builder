/**
 * Section item mixin for settings menu.
 */
export default {
	props: {
		templateData: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	computed: {
		sectionData() {
			return this.templateData;
		},
	},
};
