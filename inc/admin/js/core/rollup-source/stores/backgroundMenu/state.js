/**
 * Background menu state object.
 *
 * @type {Object}
 */
const state = {
	types: {
		selected: {
			row: 'row',
			column: 'column',
			cell: 'cell',
		},
	},
	options: {
		general: {
			headerBg: '',
			evenBg: '',
			oddBg: '',
		},
	},
	selected: {
		type: null,
		item: null,
	},
	hovered: {
		row: {
			element: null,
		},
		cell: {
			element: null,
			index: null,
		},
	},
};

/** @module state */
export default state;
