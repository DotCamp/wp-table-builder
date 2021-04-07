import { actionWatchFunction, mutationWatchFunction } from '../general';

/**
 * Watch handler for dirty state.
 *
 * @param {Object} payload current payload
 * @param {Object} state store state
 * @param {Object} store store object
 */
const dirtyWatchHandler = (payload, state, store) => {
	const currentData = {
		controls: store.getters.getDataManagerControls,
		content: store.getters.getDataManagerTempDataObject,
	};

	const backupData = { controls: store.getters.getDataBackup.controls, content: store.getters.getDataBackup.content };

	// compare current data with backup to decide dirty status
	if (JSON.stringify(currentData) !== JSON.stringify(backupData)) {
		store.commit('setAppDirty');
	} else {
		store.commit('resetAppDirtyStatus');
	}
};

/**
 * Store mutation watch list.
 *
 * @type {Object}
 */
const mutationWatchList = {
	setDataManagerControl: dirtyWatchHandler,
};

/**
 * Store action watch list.
 *
 * @type {Object}
 */
const actionWatchList = {
	before: {},
	after: {},
	bulk: {
		after: {
			setDirty: {
				actions: [
					'setDataCellValue',
					'addRowToDataManager',
					'addColumnToDataManager',
					'deleteDataTableCol',
					'deleteDataTableRow',
				],
				handler: dirtyWatchHandler,
			},
		},
	},
};

/**
 * Store plugin subscription.
 *
 * @param {Object} store data data menu store
 */
const subscribe = (store) => {
	actionWatchFunction(actionWatchList, store);
	mutationWatchFunction(mutationWatchList, store);
};

/**
 * @module subscribe
 */
export default subscribe;
