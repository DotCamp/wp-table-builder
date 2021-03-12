/**
 * Data manager state.
 *
 * @type {Object}
 */
const state = {
	tempData: {
		parsedData: {
			header: [],
			values: [],
		},
		rowIds: [],
		colIds: [],
		values: [],
		colCount: 0,
		rowCount: 0,
	},
	controls: {},
	select: {
		callerId: null,
		active: false,
		hoverId: null,
		clickId: null,
		type: 'row',
	},
	bindings: {
		row: {},
		element: {},
		column: {},
	},
};

/**
 * @module state
 */
export default state;
