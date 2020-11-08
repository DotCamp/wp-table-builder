/**
 * Data table store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Change DOM visibility of app.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {boolean} value visibility value
	 */
	setComponentVisibility({ commit }, value) {
		commit('appVisibility', value);
	},
	/**
	 * Change current screen.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {string} screenName screen name to assign as current
	 */
	setCurrentScreen({ commit }, screenName) {
		commit('setScreen', screenName);
	},
	/**
	 * Soft select a source card.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {string} sourceId selected source id
	 */
	softSelectCard({ commit }, sourceId) {
		commit('setSoftSelected', sourceId);
	},
	/**
	 * Start setup process for selected source type.
	 *
	 * For source setup to work, name your setup components as `SourceName`Setup where
	 *`SourceName` being the id for that source.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {Function} dispatch action dispatch function
	 * @param {string} sourceId selected source id
	 */
	startSourceSetup({ commit, dispatch }, sourceId) {
		// set source id
		commit('setSetupSourceId', sourceId);

		// clear temp data manager
		commit('clearTempDataManager');

		// set screen
		const screenName = `${sourceId[0].toUpperCase() + sourceId.slice(1)}Setup`;
		dispatch('setCurrentScreen', screenName);
	},
	/**
	 * Add data to temp data manager.
	 *
	 * @param {commit} vuex store object
	 * @param {Array} data data array
	 */
	addTempDataManagerData({ commit }, data) {
		commit('setTempDataManagerData', Array.isArray(data) ? data : []);
	},
	/**
	 * Set tab of current active source setup.
	 *
	 * @param {state,commit} vuex store object
	 * @param {string} tabId tab id to change to
	 */
	setActiveTabGroupForCurrentSource({ state, commit }, tabId) {
		commit('setActiveControlTabGroup', { sourceId: state.dataSource.setup.sourceId, tabId });
	},
};

export default actions;
