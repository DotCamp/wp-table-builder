/**
 * Getters for notification manager store
 *
 * @type {Object}
 */
const getters = {
	notificationTypes(state) {
		return { ...state.notificationTypes };
	},
	queueTypes(state) {
		return { ...state.queueTypes };
	},
	revealTypes(state) {
		return { ...state.revealTypes };
	},
	dismissTypes(state) {
		return { ...state.dismissTypes };
	},
	queueLength(state) {
		return state.notificationQueue.length;
	},
	getId(state) {
		return state.currentId;
	},
	defaults(state) {
		return state.defaults;
	},
	autoDismissTime(state) {
		return state.autoDismissTime;
	},
	firstInQueue(state) {
		return state.notificationQueue[0];
	},
	isAnyQueuedNotificationOnDisplay(state) {
		return state.notificationsOnDisplay.some((n) => {
			return n.queue === 'wait';
		});
	},
	getNotificationOnDisplayById(state) {
		return (id) => {
			if (state.notificationsOnDisplay.length > 0) {
				return state.notificationsOnDisplay.find((n) => {
					return n.id === id;
				});
			}
			return null;
		};
	},
};

export default getters;
