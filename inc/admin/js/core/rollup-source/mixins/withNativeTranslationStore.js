import { mapGetters } from 'vuex';

/**
 * Translation mixin for stores with strings state and translation getter.
 *
 * You can use defaultTranslationGetter in general.js for easy merge functionality into your getters.
 *
 * @type {Object}
 */
const withNativeTranslationStore = {
	computed: {
		...mapGetters(['translation']),
	},
	methods: {
		/**
		 * Translation method to be used outside of templates.
		 *
		 * @param {string} key translation key
		 */
		translationM(key) {
			return this.$store.getters.translation(key);
		},
	},
};

/* @module withNativeTranslationStore */
export default withNativeTranslationStore;
