import React from 'react';
import WptbOverlay from './WptbOverlay';

export default function BusyOverlay({ show }) {
	return (
		<WptbOverlay show={show}>
			<div className={'wptb-busy-overlay dashicons dashicons-update-alt'} />
		</WptbOverlay>
	);
}
