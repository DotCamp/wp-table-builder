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
 * Subscriptions for background menu.
 *
 * @param {Object} store store object
 */
// eslint-disable-next-line import/prefer-default-export
export const subscriptions = (store) => {
	store.watch(
		() => {
			return store.state;
		},
		saveDirectives(store.state),
		{ deep: true }
	);
};
