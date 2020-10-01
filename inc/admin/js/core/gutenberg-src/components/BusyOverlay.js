import React from 'react';

export default function BusyOverlay({ show }) {
	return (
		<div style={{ display: show ? 'flex' : 'none' }} className={'wptb-block-fetch-overlay wptb-basic-appear-anim'}>
			<div className={'dashicons dashicons-update-alt'} />
		</div>
	);
}
