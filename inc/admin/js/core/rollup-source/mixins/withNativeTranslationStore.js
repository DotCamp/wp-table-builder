import { mapGetters } from 'vuex';
import { __ } from '@wordpress/i18n';

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
		/**
		 * Translate using WordPress client function.
		 *
		 * @param {string} phrase phrase to be translated
		 * @return {string} translated string
		 */
		translationW(phrase) {
			return __(phrase, 'wp-table-builder');
		},
	},
};

/* @module withNativeTranslationStore */
export default withNativeTranslationStore;
