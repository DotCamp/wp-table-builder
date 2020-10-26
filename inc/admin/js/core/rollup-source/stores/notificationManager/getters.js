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
	queueLength(state) {
		return state.notificationQueue.length;
	},
	getId(state) {
		return state.currentId;
	},
};

export default getters;
