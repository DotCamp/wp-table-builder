import { mutationWatchFunction } from '../general';
import { getMainBuilderTable } from '../../functions';

/**
 * Save directives on change to table element data sets.
 *
 * @param {Object} state store state object
 * @return {Function} callback function for watch process
 */
const saveDirectives = (state) => () => {
	const table = document.querySelector('.wptb-table-setup .wptb-preview-table');

	table.dataset.wptbBackgroundDirectives = btoa(JSON.stringify(state));

	new WPTB_TableStateSaveManager().tableStateSet();
};

/**
 * Mutation watch list
 *
 * @type {Object}
 */
const mutationWatchList = {
	setGeneralOption: ({ payload }) => {
		const table = getMainBuilderTable();

		if (table) {
			switch (payload.subKey) {
				case 'headerBg':
			}
		}
	},
};

/**
 * Subscriptions for background menu.
 *
 * @param {Object} store store object
 */
// eslint-disable-next-line import/prefer-default-export
const subscriptions = (store) => {
	// watch store state changes
	store.watch(
		() => {
			return store.state;
		},
		saveDirectives(store.state),
		{ deep: true }
	);

	// watch store mutations
	store.subscribe(mutationWatchFunction(mutationWatchList, store));
};

/** @module subscriptions */
export default subscriptions;
