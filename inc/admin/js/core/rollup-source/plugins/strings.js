/**
 * Plugin install method.
 *
 * Plugin for adding strings data field to all components to use
 *
 * @param {Object} Vue Vue object
 * @param {Object} options options to be used at plugin
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
