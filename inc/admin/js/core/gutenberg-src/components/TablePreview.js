import React, { useEffect } from 'react';
import { withContext } from '../functions/withContext';
// eslint-disable-next-line no-unused-vars
import ExtraStyles from '../../WPTB_ExtraStyles';

function TablePreview({ content, scale, blockData: { tableCssUrl, generalStyles } }) {
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

	function prepareScript(handler, url, root) {
		const script = document.createElement('script');
		script.setAttribute('src', url);
		root.appendChild(script);
	}

	useEffect(() => {
		if (content !== null && tableCssUrl !== undefined) {
			const elem = document.createElement('div');
			elem.setAttribute('id', 'wptb-block-preview-base');

			elem.attachShadow({ mode: 'open' });

			const { shadowRoot } = elem;

			// prepare styles
			// eslint-disable-next-line array-callback-return
			Object.keys(tableCssUrl).map((handler) => {
				if (Object.prototype.hasOwnProperty.call(tableCssUrl, handler)) {
					prepareStylesheet(handler, tableCssUrl[handler], shadowRoot);
				}
			});

			// add table content to shadowroot
			const range = document.createRange();
			range.setStart(document, 0);
			const contentElement = range.createContextualFragment(
				`<div class="wptb-block-table-setup">${content}</div>`
			);
			shadowRoot.appendChild(contentElement.children[0]);

			window.WPTB_ExtraStyles.applyStyles(window.WPTB_ExtraStyles.modes.block, generalStyles, shadowRoot);

			const previewWrapper = ref.current;
			const previewTable = shadowRoot.querySelector('table');
			const maxWidth = previewTable.dataset.wptbTableContainerMaxWidth;
			const sumMaxWidth = previewTable.dataset.wptbTableContainerMaxWidth;

			let tableWidth = '700px';

			if (sumMaxWidth) {
				tableWidth = 'auto';
				previewTable.style.minWidth = `${maxWidth ? Math.max(maxWidth, sumMaxWidth) : sumMaxWidth}px`;
			} else if (maxWidth) {
				tableWidth = `${maxWidth}px`;
			}
			previewTable.style.width = tableWidth;

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

						previewTable.style.marginLeft = `-${(cellCount + 1) * borderHorizontalSpacing * -1}px`;
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
