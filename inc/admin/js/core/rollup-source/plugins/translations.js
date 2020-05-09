import { __ } from '@wordpress/i18n';

/**
 * plugin install method
 *
 * plugin for adding WordPress translation API functionality to components
 *
 * @param {Vue} Vue object
 * @param {object} options plugin options
 * @returns {object} mixin
 */
function install(Vue, options) {
	const { textDomain } = options;
	Vue.mixin({
		methods: {
			getTranslation(text) {
				return __(text, textDomain);
			},
		},
	});
}

/**
 * @module translation plugin
 */
export default { install };
