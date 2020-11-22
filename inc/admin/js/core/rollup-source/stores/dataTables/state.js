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

// @deprecated this setup is moved to an action
// const selectId = {
// 	id: null,
// 	resolve: null,
// };
//
// const clickIdHandler = {
// 	set(obj, prop, val) {
// 		if (prop === 'resolve') {
// 			// eslint-disable-next-line no-param-reassign
// 			obj[prop] = val;
// 		} else {
// 			// eslint-disable-next-line no-param-reassign
// 			obj[prop] = val;
// 			// if resolve property is defined, call it with assigned value
// 			if (obj.resolve) {
// 				obj.resolve(val);
// 			}
// 		}
//
// 		return true;
// 	},
// };
//
// // proxy for clicked cell id of select operation
// const clickIdProxy = new Proxy(selectId, clickIdHandler);

const state = {
	// whether a table is present on builder or not, starting as true so that builder screen will not be polluted with some messages bind to this value if there is a table present on startup
	tableIsActive: true,
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
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'DataSourceSelection',
	defaults: {},
};

export default state;
