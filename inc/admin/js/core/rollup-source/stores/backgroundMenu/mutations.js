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
	 * @param {HTMLElement} root.item element
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
};

/** @module mutations */
export default mutations;
