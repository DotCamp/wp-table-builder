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
					store.commit('setAppDirty');
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
