import { mapGetters } from 'vuex';

/**
 * Translation mixin for stores with strings state and translation getter.
 *
 * In order for this mixin to work, there should be a flux store with a getter of 'translation' which will use key to search for translated strings throughout store.
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
