/**
 * Generate unique id.
 *
 * @param {number} length of id to be generated
 * @return {string} generated unique id
 */
// eslint-disable-next-line import/prefer-default-export
export const generateUniqueId = (length = 5) => {
	const variables = ['a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5'];
	let key = '';

	for (let i = 0; i < length; i += 1) {
		key += variables[Math.floor(Math.random() * variables.length)];
	}

	return key;
};

/**
 * Get main table inside builder.
 *
 * @return {Element | null} main builder table
 */
export const getMainBuilderTable = () => {
	return document.querySelector('.wptb-table-setup .wptb-preview-table');
};
