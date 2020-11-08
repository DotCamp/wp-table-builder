/**
 * Data table state.
 *
 *
 *    - For source setup data
 *        Default source setup object should include these object properties to be in sync with the rest of the application
 *            - controls: left panel control values
 *            - controlGroupTab: active tabbed group id
 *
 * @type {Object}
 */
const state = {
	visibility: false,
	busy: false,
	screen: null,
	proEnabled: false,
	dataSource: {
		selected: null,
		card: {
			softSelectedId: null,
		},
		setup: {
			sourceId: null,
			csv: {
				controls: {
					delimiter: 'comma',
				},
				controlGroupTab: 'csv',
			},
			// data manager property that will be used within setup, this is not the final dataManager
			tempDataManager: {
				data: [],
			},
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'CsvSetup',
};

export default state;
