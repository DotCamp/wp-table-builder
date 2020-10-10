import React from 'react';
import { PanelRow } from '@wordpress/components';

export default function TableBlockInfoItem({ label, value }) {
	return (
		<PanelRow>
			<div className={'wptb-block-info-label'}>{label}</div>
			<div className={'wptb-block-info-value'}>{value}</div>
		</PanelRow>
	);
}
