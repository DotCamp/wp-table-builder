/**
 * Plugin install method.
 *
 * Plugin for adding app wide generic store.
 *
 * @param {object} Vue Vue object
 * @param {options} options app data to be used
 * @return {{appData: *}}
 */
function install(Vue, { data: { key, data }, methods }) {
	Vue.mixin({
		data() {
			return {
				[key]: data,
			};
		},
		methods,
	});
}

export default { install };
