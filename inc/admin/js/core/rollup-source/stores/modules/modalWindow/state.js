import deepmerge from 'deepmerge';
/**
 * Modal window store state.
 *
 * @type {Object}
 */
const state = {
	app: {
		message: 'default modal window message',
		visibility: false,
		buttons: {
			positive: null,
			negative: null,
			callback: null,
		},
	},
	backup: {},
};

const { backup, ...rest } = state;

state.backup = deepmerge({}, rest);

/**
 * @module state
 */
export default state;
