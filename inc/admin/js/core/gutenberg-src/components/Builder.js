import React, { Fragment, useState, useEffect, useRef } from 'react';

export default function Builder({ builderUrl, show, builderVisibility, updateSelection }) {
	const [gutenbergUrl, setUrl] = useState(builderUrl);
	const [frameLoaded, setFrameLoaded] = useState(false);
	const ref = useRef(null);

	function prepareUrl(val) {
		if (val) {
			const parsedUrl = new URL(val);
			parsedUrl.searchParams.append('gutenberg', true);
			setUrl(parsedUrl.toString());
		}
	}

	useEffect(() => {
		prepareUrl(builderUrl);

		if (show) {
			setFrameLoaded(false);
			ref.current.addEventListener('load', () => {
				setFrameLoaded(true);
				const refDocument = ref.current.contentDocument || ref.current.contentWindow.document;
				refDocument.addEventListener('gutenbergClose', ({ detail }) => {
					if (detail !== true) {
						if (updateSelection && typeof updateSelection === 'function') {
							updateSelection(detail);
						}
					}
					builderVisibility(false);
				});
			});
		}
	});

	return (
		<div className={`wptb-block-builder-wrapper ${show ? '' : 'hide'}`}>
			{show ? (
				<Fragment>
					<div
						style={{ display: frameLoaded ? 'none' : 'flex' }}
						className={'wptb-block-builder-load-indicator'}
					>
						<div className="dashicons dashicons-update-alt" />
					</div>
					<iframe ref={ref} className={'wptb-block-builder'} src={gutenbergUrl} />
				</Fragment>
			) : (
				''
			)}
		</div>
	);
}
