import React, { useEffect } from 'react';
import { withContext } from '../functions/withContext';

function TablePreview({ content, scale, blockData: { tableCssUrl } }) {
	const ref = React.createRef();
	const previewPadding = 40;

	useEffect(() => {
		if (content !== null && tableCssUrl !== undefined) {
			const elem = document.createElement('div');
			elem.attachShadow({ mode: 'open' });

			// add table related stylesheet to shadowroot
			const styleSheet = document.createElement('link');
			styleSheet.setAttribute('rel', 'stylesheet');
			styleSheet.setAttribute('href', tableCssUrl);
			styleSheet.setAttribute('media', 'all');
			elem.shadowRoot.appendChild(styleSheet);

			// add table content to shadowroot
			const range = document.createRange();
			range.setStart(document, 0);
			const contentElement = range.createContextualFragment(content);
			elem.shadowRoot.appendChild(contentElement);

			const previewWrapper = ref.current;
			const previewTable = elem.shadowRoot.querySelector('table');
			previewTable.style.width = scale ? '700px' : '100%';

			// clear content of preview wrapper
			previewWrapper.innerHTML = '';
			previewWrapper.appendChild(elem);

			if (scale) {
				const { width: wrapperWidth, height: wrapperHeight } = previewWrapper.getBoundingClientRect();
				const { width: previewWidth, height: previewHeight } = previewTable.getBoundingClientRect();

				const widthScale = wrapperWidth / (previewWidth + previewPadding);
				const heightScale = wrapperHeight / (previewHeight + previewPadding);

				const scaleVal = Math.min(widthScale, heightScale);
				previewTable.style.transform = `scale(${scaleVal})`;
			}
		}
	});

	return (
		<div ref={ref} className={'wptb-table-preview wptb-unselectable'}>
			<span className="dashicons dashicons-grid-view no-table-selected-preview"></span>
		</div>
	);
}

export default withContext(TablePreview);
