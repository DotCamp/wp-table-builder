/**
 * Mixin for adding easy translated strings sent from WordPress.
 *
 * @type {Object}
 */
const withTranslation = {
	props: {
		strings: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	methods: {
		translation(key) {
			if (this.strings[key]) {
				return this.strings[key];
			}
			throw new Error(`no translation found with the given key of [${key}]`);
		},
	},
};

/* @module withTranslation mixin */
export default withTranslation;
