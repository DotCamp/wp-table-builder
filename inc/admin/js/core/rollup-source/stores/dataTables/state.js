import { __ } from '@wordpress/i18n';
/**
 * Data table state.
 *
 * @type {Object}
 */
const state = {
	visibility: false,
	screen: null,
	strings: {
		dataSourceHeader: __('Select your data source', 'wp-table-builder'),
		csvTitle: __('CSV', 'wp-table-builder'),
		csvInfo: __('Upload a CSV file or create your own data on the go.', 'wp-table-builder'),
	},
};

export default state;
