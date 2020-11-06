/**
 * Data table state.
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
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'DataSourceSelection',
};

export default state;
