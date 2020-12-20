/**
 * Table background options menu.
 */
import Vue from 'vue';
import { __ } from '@wordpress/i18n';
import TableBackgroundMenu from '../containers/TableBackgroundMenu';
import createStore from '../stores/backgroundMenu';
import { objectDeepMerge } from '../stores/general';

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
		 * Decode background related table directives.
		 *
		 * @param {HTMLElement} tableElement table element
		 */
		function decodeBackgroundDirectives(tableElement) {
			const savedTableBackgroundDirectives = tableElement.dataset.wptbBackgroundDirectives;

			if (savedTableBackgroundDirectives) {
				const decodedTableBackgroundDirectives = atob(savedTableBackgroundDirectives);

				extraStoreOptions.state = objectDeepMerge(extraStoreOptions.state, decodedTableBackgroundDirectives);
			}
		}

		const table = document.querySelector('.wptb-table-setup .wptb-preview-table');

		if (table) {
			decodeBackgroundDirectives(table);
		} else {
			// if no table is found, add an event listener to table generated event
			document.addEventListener('wptb:table:generated', () => {
				decodeBackgroundDirectives(document.querySelector('.wptb-table-setup .wptb-preview-table'));
			});
		}

		const store = createStore(extraStoreOptions);

		new Vue({
			store,
			components: { TableBackgroundMenu },
			template: '<table-background-menu></table-background-menu>',
		}).$mount(`#${uniqueId}`);
	},
};
