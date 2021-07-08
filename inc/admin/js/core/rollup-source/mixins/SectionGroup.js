/**
 * Section group collapse mixin.
 */
export default {
	props: {
		settings: {
			type: Object,
			default: () => {
				return {};
			},
		},
		generalDisabledStatus: {
			type: Boolean,
			default: false,
		},
	},
};
