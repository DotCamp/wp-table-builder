/**
 * Table data menu store state.
 *
 * @type {Object}
 */
const state = {
	app: {
		busy: false,
		message: {
			type: 'ok',
			content: '',
		},
	},
	editor: {
		activeId: null,
	},
};

/**
 * @module state
 */
export default state;
