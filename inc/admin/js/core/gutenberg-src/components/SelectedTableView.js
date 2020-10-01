import React from 'react';
import ReactDOM from 'react-dom';
import { __ } from '@wordpress/i18n';
import TablePreview from './TablePreview';
import BlockButton from './BlockButton';

export default function SelectedTableView({ selectedTable, footerRightPortal, changeToSelect }) {
	return (
		<div className={'wptb-table-selected-view wptb-basic-appear-anim'}>
			<TablePreview scale={true} content={selectedTable ? selectedTable.content : null} />
			{footerRightPortal !== null
				? ReactDOM.createPortal(
						<BlockButton onClick={changeToSelect}>{__('change', 'wp-table-builder')}</BlockButton>,
						footerRightPortal.current
				  )
				: ''}
		</div>
	);
}
