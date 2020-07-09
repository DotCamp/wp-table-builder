/**
 * Plugin for reusable.
 *
 * @param {object} Vue Vue instance
 * @param {object} options filter options
 */
// eslint-disable-next-line no-unused-vars
function install(Vue, options) {
	// capitalize filter
	Vue.filter('cap', (val) => {
		return val
			.split(' ')
			.map((v) => v[0].toUpperCase() + v.slice(1))
			.join(' ');
	});
}

export default { install };
