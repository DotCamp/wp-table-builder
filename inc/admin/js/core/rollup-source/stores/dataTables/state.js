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
	// whether a table is present on builder or not, starting as true so that builder screen will not be polluted with some messages bind to this value if there is a table present on startup
	tableIsActive: true,
	targetTable: null,
	visibility: false,
	busy: false,
	screen: null,
	proEnabled: false,
	dataSource: {
		dataObject: {
			title: '',
			id: null,
			type: null,
			controls: {
				firstRowAsColumnName: false,
				indexRow: null,
			},
			content: {},
		},
		card: {
			softSelectedId: 'existing',
		},
		setup: {
			title: '',
			sourceId: null,
			sourceDataCreated: false,
			csv: {
				controls: {
					delimiter: 'comma',
				},
				controlGroupTab: 'csv',
			},
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'DataSourceSelection',
	defaults: {},
};

export default state;
