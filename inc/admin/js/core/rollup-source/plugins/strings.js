/**
 * plugin install method
 *
 * plugin for adding strings data field to all components to use
 *
 * @param {object} Vue Vue object
 * @param {object} options options to be used at plugin
 * @returns {{strings: boolean}}
 */
function install(Vue, options) {
	Vue.mixin({
		data() {
			return {
				strings: options.strings,
			};
		},
	});
}

/**
 * @module strings plugin
 */
export default { install };
