import React from 'react';

export default function WptbOverlay({ show, children }) {
	return (
		<div className={'wptb-block-overlay wptb-basic-appear-anim'} style={{ display: show ? 'flex' : 'none' }}>
			{children}
		</div>
	);
}
