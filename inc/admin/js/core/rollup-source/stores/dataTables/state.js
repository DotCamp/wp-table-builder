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
					csvImported: false,
					delimiter: 'comma',
				},
				controlGroupTab: 'csv',
			},
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'CsvSetup',
};

export default state;
