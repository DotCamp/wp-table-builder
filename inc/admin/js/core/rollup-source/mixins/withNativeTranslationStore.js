import { mapGetters } from 'vuex';

/**
 * Translation mixin for stores with strings state and translation getter.
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
