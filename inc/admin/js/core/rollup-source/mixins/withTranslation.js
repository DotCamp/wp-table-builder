/**
 * Mixin for adding easy translated strings sent from WordPress.
 * @type {{methods: {translation(*): (withTranslation.methods.strings.key|undefined)}, props: {strings: {default: (function(): []), type: ArrayConstructor}}}}
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
