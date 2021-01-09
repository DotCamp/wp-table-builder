/**
 * Background menu mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Set a general option value.
	 *
	 * @param {Object} state background menu state object
	 *
	 * @param {Object} root mutation object
	 * @param {string} root.subKey sub key for general option
	 * @param {null|string|Object|Array|number} root.value option value
	 */
	setGeneralOption: (state, { subKey, value }) => {
		// eslint-disable-next-line no-param-reassign
		state.options.general[subKey] = value;
	},
	/**
	 * Set a table element as selected.
	 *
	 * @param {Object} state background menu state object
	 * @param {Object} root mutation object
	 * @param {string} root.type element type
	 * @param {HTMLElement | Array} root.item element or array of elements
	 */
	setMenuSelectedTableElement: (state, { type, item }) => {
		// eslint-disable-next-line no-param-reassign
		state.selected.type = type;
		// eslint-disable-next-line no-param-reassign
		state.selected.item = item;
	},
	/**
	 * Set table as dirty.
	 */
	markTableDirty: () => {
		new WPTB_TableStateSaveManager().tableStateSet();
	},
	/**
	 * Update current row element which is hovered.
	 *
	 * @param {Object} state background menu state object
	 * @param {Element} rowElement row element that is hovered
	 */
	updateHoveredRowElement: (state, rowElement) => {
		// eslint-disable-next-line no-param-reassign
		state.hovered.row.element = rowElement;
	},
	/**
	 * Update current cell element which is hovered.
	 *
	 * @param {Object} state background menu state object
	 * @param {Object} root payload
	 * @param {Object} root.element hovered cell element
	 * @param {number} root.index elements index on its container row
	 */
	updateHoveredCellElement: (state, { element, index }) => {
		// eslint-disable-next-line no-param-reassign
		state.hovered.cell.element = element;
		// eslint-disable-next-line no-param-reassign
		state.hovered.cell.index = index;
	},
};

/** @module mutations */
export default mutations;
