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
		selected: null,
		card: {
			softSelectedId: null,
		},
		setup: {
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
	dataManager: {
		tempData: {
			parsedData: {
				header: [],
				values: [],
			},
			rowIds: [],
			colIds: [],
			values: [],
			colCount: 0,
			rowCount: 0,
		},
		controls: {
			firstRowAsColumnName: false,
			indexRow: null,
		},
		select: {
			callerId: null,
			active: false,
			hoverId: null,
			clickId: null,
			type: 'row',
		},
		bindings: {
			row: {},
			element: {},
			column: {},
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'DataSourceSelection',
	defaults: {},
};

export default state;
