import { actionWatchFunction } from '../general';

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
				handler: (payload, state, store) => {
					const currentData = {
						controls: store.getters.getDataManagerControls,
						content: store.getters.getDataManagerTempDataObject,
					};

					const backupData = store.getters.getDataBackup;

					// compare current data with backup to decide dirty status
					if (JSON.stringify(currentData) !== JSON.stringify(backupData)) {
						store.commit('setAppDirty');
					} else {
						store.commit('resetAppDirtyStatus');
					}
				},
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
};

/**
 * @module subscribe
 */
export default subscribe;
