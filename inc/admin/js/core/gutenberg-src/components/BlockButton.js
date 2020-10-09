import React from 'react';

export default function BlockButton({ type, onClick, children, disabled }) {
	return (
		<div
			onClick={onClick}
			className={`wptb-block-button wptb-unselectable ${type || 'primary'} ${
				disabled ? 'wptb-block-button-disabled' : ''
			}`}
		>
			{children}
		</div>
	);
}
