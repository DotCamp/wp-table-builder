import React, { useEffect } from 'react';
import { withContext } from '../functions/withContext';

function TablePreview({ content, scale, blockData: { tableCssUrl } }) {
	const ref = React.createRef();
	const previewPadding = 40;

	function prepareStylesheet(handler, url, root) {
		const styleSheet = document.createElement('link');
		styleSheet.setAttribute('rel', 'stylesheet');
		styleSheet.setAttribute('href', url);
		styleSheet.setAttribute('media', 'all');
		styleSheet.setAttribute('id', handler);
		root.appendChild(styleSheet);
	}

	useEffect(() => {
		if (content !== null && tableCssUrl !== undefined) {
			const elem = document.createElement('div');

			elem.attachShadow({ mode: 'open' });

			// eslint-disable-next-line array-callback-return
			Object.keys(tableCssUrl).map((handler) => {
				if (Object.prototype.hasOwnProperty.call(tableCssUrl, handler)) {
					prepareStylesheet(handler, tableCssUrl[handler], elem.shadowRoot);
				}
			});

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

				// fix for chrome browsers where table previews are distorted for tables with separated columns and row
				if (window.navigator.vendor.includes('Google')) {
					if (previewTable.style.borderCollapse === 'separate') {
						const borderHorizontalSpacing = parseInt(previewTable.dataset.borderSpacingColumns, 10);
						const cellCount = parseInt(previewTable.dataset.wptbCellsWidthAutoCount, 10);

						previewTable.style.marginLeft = `${(cellCount + 1) * borderHorizontalSpacing * -1}px`;
					}
				}
			}
		}
	});

	return (
		<div ref={ref} className={'wptb-table-preview wptb-unselectable'}>
			<span className="dashicons dashicons-grid-view no-table-selected-preview" />
		</div>
	);
}

export default withContext(TablePreview);
