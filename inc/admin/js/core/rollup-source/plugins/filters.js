export const cap = function cap(val) {
	return val
		.split(' ')
		.map((v) => v[0].toUpperCase() + v.slice(1))
		.join(' ');
};

/**
 * Plugin for reusable.
 *
 * @param {Object} Vue Vue instance
 * @param {Object} options filter options
 */
// eslint-disable-next-line no-unused-vars
function install(Vue, options) {
	// capitalize filter
	Vue.filter('cap', cap);
}

export default { install };
