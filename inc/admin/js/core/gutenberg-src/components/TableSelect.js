import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { __ } from '@wordpress/i18n';
import TableSearch from './TableSearch';
import TableList from './TableList';
import TablePreview from './TablePreview';
import BlockButton from './BlockButton';

export default function TableSelect({
	searchTerm,
	updateSearch,
	selectedId,
	rowSelected,
	filteredTables,
	selectedTable,
	saveTable,
	footerRightPortal,
	savedId,
	setSelectScreen,
}) {
	return (
		<div className={'wptb-table-select'}>
			<div className={'wptb-table-list-wrapper'}>
				<TableSearch searchTerm={searchTerm} updateSearch={updateSearch} />
				<TableList
					searchTerm={searchTerm}
					selectedId={selectedId}
					rowSelected={rowSelected}
					tables={filteredTables()}
					activeId={savedId}
				/>
			</div>
			<TablePreview scale={true} content={selectedTable ? selectedTable.content : null} />
			{footerRightPortal !== null
				? ReactDOM.createPortal(
						<Fragment>
							{savedId >= 0 ? (
							<BlockButton onClick={() => setSelectScreen(false)} type={'negative'}>
									{__('cancel', 'wp-table-builder')}
								</BlockButton>
							) : (
								''
							)}
							<BlockButton disabled={!selectedTable || savedId === selectedId} onClick={saveTable}>
								{__('select', 'wp-table-builder')}
							</BlockButton>
						</Fragment>,
						footerRightPortal.current
				  )
				: ''}
		</div>
	);
}
