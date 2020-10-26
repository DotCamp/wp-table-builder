/**
 * Mutations for notification manager store.
 *
 * @type {Object}
 */
const mutations = {
	addNotificationToQueue(state, notificationObj) {
		state.notificationQueue.push(notificationObj);
	},
	addNotificationToDisplay(state, notificationObj) {
		state.notificationsOnDisplay.push(notificationObj);
	},
	incrementId(state) {
		// eslint-disable-next-line no-param-reassign
		state.currentId += 1;
	},
};

export default mutations;
