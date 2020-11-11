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

const selectId = {
	id: null,
	resolve: null,
};

const clickIdHandler = {
	set(obj, prop, val) {
		if (prop === 'resolve') {
			// eslint-disable-next-line no-param-reassign
			obj[prop] = val;
		} else {
			// eslint-disable-next-line no-param-reassign
			obj[prop] = val;
			// if resolve property is defined, call it with assigned value
			if (obj.resolve) {
				obj.resolve(val);
			}
		}

		return true;
	},
};

// proxy for clicked cell id of select operation
const clickIdProxy = new Proxy(selectId, clickIdHandler);

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
				controlGroupTab: 'dataManager',
			},
		},
	},
	dataManager: {
		tempData: {
			rowIds: [],
			colIds: [],
			values: [],
			colCount: 0,
			rowCount: 0,
		},
		controls: {
			firstRowAsColumnName: true,
		},
		select: {
			callerId: null,
			active: false,
			hoverId: null,
			clickId: clickIdProxy,
			type: 'row',
		},
	},
	leftPanelId: '#dataTableLeftPanel',
	devStartupScreen: 'CsvSetup',
};

export default state;
