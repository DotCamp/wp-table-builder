import React from 'react';

export default function TableList({ tables, rowSelected, selectedId, searchTerm }) {
	const indicateFoundTerm = (value) => {
		const parsedVal = `${value}`;
		const regexp = new RegExp(`(${searchTerm})`, 'ig');

		return parsedVal.replace(regexp, '<span class="wptb-block-search-indicator">$&</span>');
	};

	return (
		<div className={'wptb-table-list'}>
			{tables.map((table) => {
				return (
					<div
						onClick={rowSelected(table.id)}
						className={`wptb-table-list-row wptb-basic-appear-anim ${
							selectedId === table.id ? 'selected' : ''
						}`}
						key={table.id}
					>
						<div
							className={'wptb-table-list-title'}
							dangerouslySetInnerHTML={{ __html: indicateFoundTerm(table.title) }}
						/>
						<div
							className={'wptb-table-list-id'}
							dangerouslySetInnerHTML={{ __html: indicateFoundTerm(table.id) }}
						/>
					</div>
				);
			})}
		</div>
	);
}
