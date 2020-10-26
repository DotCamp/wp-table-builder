/* eslint-disable jsdoc/check-param-names */
/**
 * Actions for notification manager store.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Add a notification to manager .
	 *
	 * @param {Function} commit store commit function
	 * @param {Object} getters store getters
	 * @param {Object} dispatch store dispatch function
	 * @param {Object} notificationObj notification object to be added
	 * @return {Promise<void>}
	 */
	async addNotification({ commit, getters, dispatch }, notificationObj) {
		const { wait } = notificationObj;

		// add an id to notification object
		// eslint-disable-next-line no-param-reassign
		notificationObj.id = await dispatch('generateId');

		// check for wait type of object
		// if it is set to wait add it to queue
		if (wait === 'wait') {
			commit('addNotificationToQueue', notificationObj);

			// if queue is empty, immediately move current notification to display and show
			if (getters.queue === 0) {
				dispatch('moveQueToDisplay');
			}
			// else add it to display immediately
		} else {
			commit('addNotificationToDisplay', notificationObj);
		}
	},
	/**
	 * Move first notification waiting on queue to display.
	 *
	 * @param {Function} commit store commit function
	 * @param {Object} state store state
	 */
	moveQueToDisplay({ commit, state }) {
		// remove and get first notification waiting at queue
		const notification = state.notificationQueue.shift();
		commit('addNotificationToDisplay', notification);
	},
	/**
	 * Generate a unique id.
	 *
	 * @param {Function} commit store commit function
	 * @param {Object} getters store getters
	 * @return {string} generated id
	 */
	generateId({ commit, getters }) {
		commit('incrementId');
		return getters.getId;
	},
};

export default actions;
