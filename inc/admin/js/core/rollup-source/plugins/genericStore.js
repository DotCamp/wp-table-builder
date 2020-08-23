/**
 * Plugin install method.
 *
 * Plugin for adding app wide generic store.
 *
 * @param {object} Vue Vue object
 * @param {options} options app data to be used
 * @return {{appData: *}}
 */
function install(Vue, { key, data }) {
	Vue.mixin({
		data() {
			return {
				[key]: data,
			};
		},
	});
}

export default { install };
