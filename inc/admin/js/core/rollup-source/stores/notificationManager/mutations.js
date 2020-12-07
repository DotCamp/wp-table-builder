/**
 * Mutations for notification manager store.
 *
 * @type {Object}
 */
const mutations = {
	shiftQueue(state) {
		state.notificationQueue.shift();
	},
	addNotificationToQueue(state, notificationObj) {
		state.notificationQueue.push(notificationObj);
	},
	addToQueuedDisplay(state, notification) {
		state.notificationsOnDisplay.unshift(notification);
	},
	addNotificationToDisplay(state, notificationObj) {
		state.notificationsOnDisplay.push(notificationObj);
	},
	incrementId(state) {
		// eslint-disable-next-line no-param-reassign
		state.currentId += 1;
	},
	removeNotification(state, id) {
		let foundIndex = null;
		state.notificationsOnDisplay.find((val, index) => {
			if (val.id === id) {
				foundIndex = index;
			}
		});

		if (foundIndex !== null && foundIndex !== undefined) {
			// state.notificationsOnDisplay = state.notificationsOnDisplay.slice(foundIndex, 1);
			state.notificationsOnDisplay.splice(foundIndex, 1);
		}
	},
};

export default mutations;
