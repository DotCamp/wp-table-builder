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
	 * @param {Function} dispatch store dispatch function
	 * @param {Object} notificationObj notification object to be added
	 * @return {Promise<void>}
	 */
	async addNotification({ commit, getters, dispatch }, notificationObj) {
		const { queue } = notificationObj;

		// add an id to notification object
		// eslint-disable-next-line no-param-reassign
		notificationObj.id = await dispatch('generateId');

		// check for wait type of object
		// if it is set to wait add it to queue
		if (queue === 'wait') {
			commit('addNotificationToQueue', notificationObj);

			// if there is no notification with wait queue type is active on current display
			if (!getters.isAnyQueuedNotificationOnDisplay) {
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
	moveQueToDisplay({ commit, getters }) {
		// remove and get first notification waiting at queue
		const notification = getters.firstInQueue;
		if (notification) {
			commit('shiftQueue');
			commit('addToQueuedDisplay', notification);
		}
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
	/**
	 * Remove notification from displayed notifications.
	 *
	 * @param {Function} commit store commit function
	 * @param {Object} getters store getters
	 * @param {Function} dispatch store dispatch function
	 * @param {number} id notification id
	 */
	removeNotification({ commit, getters, dispatch }, id) {
		const notificationToBeRemoved = getters.getNotificationOnDisplayById(id);
		commit('removeNotification', id);
		if (notificationToBeRemoved && notificationToBeRemoved.queue === 'wait') {
			dispatch('moveQueToDisplay');
		}
	},
};

export default actions;
