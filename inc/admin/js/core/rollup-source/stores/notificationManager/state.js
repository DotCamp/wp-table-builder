/**
 *Default state for notification manager
 *
 * @type {Object} default state
 */
const defaultState = {
	notificationQueue: [],
	notificationsOnDisplay: [],
	notificationTypes: {
		normal: 'ok',
		info: 'info',
		error: 'error',
		pro: 'pro',
	},
	queueTypes: {
		wait: 'wait',
		instant: 'instant',
	},
	revealTypes: {
		icon: 'icon',
		full: 'full',
	},
	dismissType: {
		no: 'no',
		timed: 'timed',
		click: 'click',
	},
	autoDismissTime: 3000,
	currentId: 0,
};

/**
 * Merge default state with extra ones and create new one.
 *
 * @param {Object} extraState extra state values to add
 */
const createState = (extraState) => {
	return { ...defaultState, ...extraState };
};

export default createState;
