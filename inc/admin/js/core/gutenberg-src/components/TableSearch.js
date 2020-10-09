import { __ } from '@wordpress/i18n';
import React from 'react';

/**
 * Table search component.
 *
 * @param {string} searchTerm current search term
 * @param {Function} updateSearch function to update search term state on calling component
 * @return {JSX.Element} table search component
 * @class
 */
export default function TableSearch({ searchTerm, updateSearch }) {
	return (
		<div className={'wptb-table-search'}>
			<input
				value={searchTerm}
				onChange={(e) => updateSearch(e.target.value)}
				type="text"
				placeholder={__('search for tables', 'wp-table-builder')}
			/>
			{searchTerm !== '' ? (
				<div className={'wptb-search-clear'} onClick={() => updateSearch('')}>
					X
				</div>
			) : (
				''
			)}
		</div>
	);
}
