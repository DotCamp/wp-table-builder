/**
 * Plugin install method.
 *
 * Plugin for adding app wide generic store.
 *
 * @param {object} Vue Vue object
 * @param {options} options app data to be used
 * @return {{appData: *}}
 */
function install(Vue, options) {
	Vue.mixin({
		data() {
			return {
				appData: options,
			};
		},
	});
}

export default { install };
