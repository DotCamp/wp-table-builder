/**
 * Table background options menu.
 */
import Vue from 'vue';
import { __ } from '@wordpress/i18n';
import merge from 'deepmerge';
import TableBackgroundMenu from '../containers/TableBackgroundMenu';
import createStore from '../stores/backgroundMenu';
import { getMainBuilderTable } from '../functions';

export default {
	name: 'BackgroundMenu',
	handler: (uniqueId) => {
		const extraStoreOptions = {
			state: {
				strings: {
					generalRow: __('general row color options', 'wp-table-builder'),
					evenRow: __('even row background', 'wp-table-builder'),
					oddRow: __('odd row background', 'wp-table-builder'),
					headerBg: __('header background', 'wp-table-builder'),
				},
			},
		};

		/**
		 * Parse various store state values from table element.
		 *
		 * @param {HTMLElement} tableElement table element
		 */
		function parseStateFromTable(tableElement) {
			const parsedFromTable = {
				options: {
					general: {},
				},
			};

			const parsedGeneral = {
				headerBg: tableElement.dataset.wptbHeaderBackgroundColor,
				evenBg: tableElement.dataset.wptbEvenRowBackgroundColor,
				oddBg: tableElement.dataset.wptbOddRowBackgroundColor,
			};

			parsedFromTable.options.general = Object.keys(parsedGeneral).reduce((carry, item) => {
				if (Object.prototype.hasOwnProperty.call(parsedGeneral, item)) {
					const currentValue = parsedGeneral[item];
					if (currentValue !== null && currentValue !== '') {
						// eslint-disable-next-line no-param-reassign
						carry[item] = currentValue;
					}
				}

				return carry;
			}, {});

			return parsedFromTable;
		}

		extraStoreOptions.state = merge(extraStoreOptions.state, parseStateFromTable(getMainBuilderTable()));

		const store = createStore(extraStoreOptions);

		new Vue({
			store,
			components: { TableBackgroundMenu },
			template: '<table-background-menu></table-background-menu>',
		}).$mount(`#${uniqueId}`);
	},
};
