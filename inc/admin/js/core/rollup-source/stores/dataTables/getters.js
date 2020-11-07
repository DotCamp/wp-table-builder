/**
 * Data table getter methods.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get visibility state.
	 *
	 * @param {Object} state store state
	 * @return {boolean} visibility
	 */
	isVisible(state) {
		return state.visibility;
	},
	/**
	 * Get current screen of data table.
	 *
	 * @param {Object} state store state
	 * @return {string} current screen
	 */
	currentScreen(state) {
		return state.screen;
	},
	/**
	 * Get soft selected source card id.
	 *
	 * Soft selected card is the one that is selected but not confirmed.
	 *
	 * @param {Object} state store state
	 * @return {string} soft selected card id
	 */
	getSoftSelectedSourceCardId(state) {
		return state.dataSource.card.softSelectedId;
	},
	/**
	 * Get pro version status of the plugin.
	 *
	 * @param {Object} state store state
	 * @return {boolean} pro version status
	 */
	getProStatus(state) {
		return state.proEnabled;
	},
	/**
	 * Is any csv file imported at csv source setup.
	 *
	 * @param {Object} state store state
	 * @return {boolean} any csv file imported or not
	 */
	isCsvImported(state) {
		return state.dataSource.setup.csv.csvImported;
	},
	/**
	 * Get active tab group id for source setup
	 *
	 * @param {Object} state store state
	 * @param {string} sourceId source id
	 * @return {Function} function to get active setup group tab
	 */
	currentSetupGroupTab: (state) => (sourceId) => {
		return state.dataSource.setup[sourceId].controlGroupTab;
	},
	/**
	 * Get active tab group id for source setup.
	 *
	 * @param {Object} state store state
	 * @param {Object} getters getters
	 * @return {boolean} source setup or not
	 */
	// eslint-disable-next-line no-shadow
	isActiveScreenSourceSetup(state, getters) {
		const { currentScreen } = getters;

		return currentScreen.match(/^(.+)Setup$/g);
	},
};

export default getters;
