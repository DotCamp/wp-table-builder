document.addEventListener('DOMContentLoaded', function () {
	const tableContainers = document.getElementsByClassName('wptb-table-container');

	/**
	 * Adds hover color change support for supported button elements.
	 *
	 * @param {string} querySelector query selector string
	 */
	function addHoverSupport(querySelector) {
		const buttons = Array.from(document.querySelectorAll(querySelector));

		// eslint-disable-next-line array-callback-return
		buttons.map((b) => {
			b.addEventListener('mouseenter', (e) => {
				const el = e.target;
				// hover background-color
				if (el.dataset.wptbElementHoverBgColor) {
					el.style.backgroundColor = el.dataset.wptbElementHoverBgColor;
				}
				// hover color
				if (el.dataset.wptbElementHoverTextColor) {
					el.style.color = el.dataset.wptbElementHoverTextColor;
				}
				// hover scale
				if (el.dataset.wptbElementHoverScale) {
					el.style.transform = `scale(${b.dataset.wptbElementHoverScale})`;
				}
			});

			b.addEventListener('mouseleave', (e) => {
				// reset all supported hover properties to their default value
				const el = e.target;
				if (el.dataset.wptbElementHoverBgColor) {
					el.style.backgroundColor = el.dataset.wptbElementBgColor;
				}
				if (el.dataset.wptbElementHoverTextColor) {
					el.style.color = el.dataset.wptbElementColor;
				}
				if (el.dataset.wptbElementHoverScale) {
					el.style.transform = 'scale(1)';
				}
			});
		});
	}

	// add all kind of functions that have event listeners before responsive table reconstruction to make sure those event listeners are carried over to their clones
	addHoverSupport('.wptb-preview-table .wptb-button');

	wptb_tdDefaultWidth();
	wptb_tableReconstraction();

	function wptb_tableReconstraction() {
		for (let i = 0; i < tableContainers.length; i++) {
			const tableContainer = tableContainers[i];

			// Set default indicator of creating a new table in true
			let createNewTableIndic = true;

			let previewTable = tableContainer.getElementsByClassName('wptb-preview-table');
			let tableContainerMatrix = tableContainer.getElementsByClassName('wptb-table-container-matrix');

			if (previewTable.length > 0 && tableContainerMatrix.length > 0) {
				previewTable = previewTable[0];
				tableContainerMatrix = tableContainerMatrix[0];
				previewTable.style.display = 'table';

				if (previewTable.dataset.wptbTableAlignment) {
					const { wptbTableAlignment } = previewTable.dataset;

					const wptbTableContainerWidth = tableContainer.offsetWidth;
					if (wptbTableContainerWidth < previewTable.offsetWidth) {
						previewTable.style.float = null;
					} else if (wptbTableAlignment == 'center') {
						previewTable.style.float = null;
					} else {
						previewTable.style.float = wptbTableAlignment;
					}

					if (wptbTableAlignment == 'center') {
						tableContainer.style.float = null;
					} else {
						tableContainer.style.float = wptbTableAlignment;
					}
				}

				// check data parametrs reconstraction and wptbAdaptiveTable if they are both equal 1 then continue
				if (previewTable.dataset.reconstraction == 1 && previewTable.dataset.wptbAdaptiveTable == 1) {
					// get widths for wptb-table-container and wptb-preview-table
					const tableContainerWidth = tableContainer.offsetWidth;
					const previewTableWidth = previewTable.offsetWidth;

					// get count of table columns
					let tableColumns;
					const previewTableRows = previewTable.rows;
					if (previewTableRows.length > 0) {
						const firstRow = previewTableRows[0];
						const tdsRow = firstRow.querySelectorAll('td');

						tableColumns = tdsRow.length;
					}

					// check the top line if it is presented as a title
					const tablePreviewHeadIndic = previewTable.classList.contains('wptb-table-preview-head');

					// check conditions: if table top row is as "header" - table must have more that two columns,
					// otherwise table must have more taht one columns
					let tableReconstructed = false;
					let wptbPreviewTableMobile;
					if ((!tablePreviewHeadIndic || tableColumns > 2) && tableColumns > 1) {
						// if width of wptb-table-container less then width of wptb-preview-table -
						// continue the way creation new mobile table
						if (tableContainerWidth < previewTableWidth) {
							tableContainer.style.overflow = 'unset';

							// hide wptb-table-container-matrix
							if (tableContainerMatrix && !tableContainerMatrix.classList.contains('wptb-matrix-hide')) {
								tableContainerMatrix.classList.add('wptb-matrix-hide');
								tableReconstructed = true;
							}
							previewTable.classList.add('wptb-mobile-view-active');

							if (previewTable.rows && tableColumns) {
								// we get the estimated cell width
								const tdWidth = previewTableWidth / tableColumns;

								// get the quantity of whole Columns that are can placed in the container
								let wholeColumnsInContainer = Math.floor(tableContainerWidth / tdWidth);
								if (wholeColumnsInContainer < 1) wholeColumnsInContainer = 1;

								// check for the existence of a mobile table
								// if it available, check this table for compliance
								// with our conditions. If it compliance, remain this table
								// and cancel creating a new table ( createNewTableIndic = false ).
								if (tableContainer.getElementsByClassName('wptb-preview-table-mobile').length > 0) {
									wptbPreviewTableMobile = tableContainer.getElementsByClassName(
										'wptb-preview-table-mobile'
									)[0];
									wptbPreviewTableMobile.classList.remove('wptb-mobile-hide');
									const dataWholeColumnInContainer =
										wptbPreviewTableMobile.dataset.wholeColumnsInContainer;

									if (
										dataWholeColumnInContainer == wholeColumnsInContainer &&
										previewTable.classList.contains('wptb-table-preview-head')
									) {
										createNewTableIndic = false;
									} else if (
										dataWholeColumnInContainer == wholeColumnsInContainer &&
										!previewTable.classList.contains('wptb-table-preview-head') &&
										(tableContainerWidth > 480 || wptbPreviewTableMobile.column == 1)
									) {
										createNewTableIndic = false;
									} else {
										wptbPreviewTableMobile.parentNode.removeChild(wptbPreviewTableMobile);
									}
								}
								//
								// if indicator of creating of table "true" - continue
								if (createNewTableIndic) {
									// create new table for mobile devices
									const newTable = document.createElement('table');
									const newTableTbody = document.createElement('tbody');
									newTable.appendChild(newTableTbody);

									// add css class for new mobile table
									newTable.classList.add('wptb-preview-table-mobile');
									const infArr = previewTable.className.match(/wptb-element-main(.+)-(\d+)/i);
									if (infArr && Array.isArray(infArr)) {
										newTable.classList.add(infArr[0]);
									}

									// get number of rows for wptb-preview-table
									const tableRows = previewTable.rows.length;

									// In this variable must have quantity columns of the last section of the new table
									let newTableLastSectionFilledColumns;

									// set valuesIsSaved in 'false'
									// if the parameters newTableLastSectionFilledColumns get
									// optimal values, valuesIsSaved must have value 'true'
									let valuesIsSaved = false;

									// check if top row is as "header"
									if (previewTable.classList.contains('wptb-table-preview-head')) {
										// quantity rows without top row
										const tableRowsWithoutHeader = tableRows - 1;

										// this variable will have quantity columns in new mobile table
										let newTableColumnsWithoutLeftHeader;

										// if quantity of rows in desktop table more than
										// quantity whole columns which are can placed in the container,
										// execute "loop for"
										if (tableRows > wholeColumnsInContainer) {
											// this code, сyclical reduces the number of columns in the new table,
											// until the optimal view is obtained so that the last block of the new table
											// has more than half the columns compared to the previous blocks
											for (let i = 0; i < tableRowsWithoutHeader; i++) {
												newTableColumnsWithoutLeftHeader = wholeColumnsInContainer - 1 - i;
												if (newTableColumnsWithoutLeftHeader <= 0)
													newTableColumnsWithoutLeftHeader = 1;

												newTableLastSectionFilledColumns =
													tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;

												if (newTableLastSectionFilledColumns == 0) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumnsWithoutLeftHeader > 0 &&
													newTableColumnsWithoutLeftHeader <= 6 &&
													newTableColumnsWithoutLeftHeader -
														2 * newTableLastSectionFilledColumns <
														0 &&
													newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader
												) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumnsWithoutLeftHeader > 6 &&
													newTableColumnsWithoutLeftHeader <= 12 &&
													newTableColumnsWithoutLeftHeader -
														1.8 * newTableLastSectionFilledColumns <
														0 &&
													newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader
												) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumnsWithoutLeftHeader > 12 &&
													newTableColumnsWithoutLeftHeader <= 18 &&
													newTableColumnsWithoutLeftHeader -
														1.6 * newTableLastSectionFilledColumns <
														0 &&
													newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader
												) {
													valuesIsSaved = true;
													break;
												} else {
													continue;
												}
											}
										} else {
											newTableColumnsWithoutLeftHeader = tableRowsWithoutHeader;
											newTableLastSectionFilledColumns = 0;
											valuesIsSaved = true;
										}

										// if all necessary values ​​are available (  ), execute
										if (valuesIsSaved) {
											let countRows;
											if (newTableColumnsWithoutLeftHeader > 0) {
												countRows =
													tableColumns *
													Math.ceil(
														tableRowsWithoutHeader / newTableColumnsWithoutLeftHeader
													);
											} else {
												countRows = tableColumns;
											}

											const sectionNumberLast = Math.floor((countRows - 1) / tableColumns);
											let tdStyles;
											for (let j = 0; j < countRows; j++) {
												const sectionNumber = Math.floor(j / tableColumns);
												const tr = document.createElement('tr');
												const tdLeftHeader = previewTable.rows[0].children[
													j - sectionNumber * tableColumns
												].cloneNode(true);
												let td;
												const rowFirstStyles = window.getComputedStyle(previewTable.rows[0]);
												if (!tdLeftHeader.style.backgroundColor) {
													tdLeftHeader.style.backgroundColor = rowFirstStyles.backgroundColor;
												}
												tdLeftHeader.style.width = null;
												tdLeftHeader.style.height = null;
												// tdLeftHeader.removeAttribute('data-x-index');
												tdLeftHeader.removeAttribute('data-wptb-css-td-auto-width');
												tdStyles = window.getComputedStyle(previewTable.querySelector('td'));
												if (tdStyles.borderTopColor) {
													tdLeftHeader.style.borderColor = tdStyles.borderTopColor;
												} else {
													tdLeftHeader.style.borderColor = tdStyles.borderBottomColor;
												}
												if (sectionNumber > 0 && j % tableColumns == 0) {
													tdLeftHeader.style.borderTopWidth = '5px';
												}
												tr.appendChild(tdLeftHeader);

												for (
													let k = newTableColumnsWithoutLeftHeader * sectionNumber + 1;
													k < newTableColumnsWithoutLeftHeader * (sectionNumber + 1) + 1;
													k++
												) {
													if (k < previewTable.rows.length) {
														td = previewTable.rows[k].children[
															j - sectionNumber * tableColumns
														].cloneNode(true);
														const rowKStyles = window.getComputedStyle(
															previewTable.rows[k]
														);
														if (!td.style.backgroundColor) {
															td.style.backgroundColor = rowKStyles.backgroundColor;
														}

														td.style.width = null;
														td.style.height = null;
														// td.removeAttribute('data-x-index');
														td.removeAttribute('data-wptb-css-td-auto-width');
													} else {
														td = document.createElement('td');
														td.style.borderWidth = '0px';

														td.style.background = '#fff';
													}

													tdStyles = window.getComputedStyle(
														previewTable.querySelector('td')
													);
													if (tdStyles.borderTopColor) {
														td.style.borderColor = tdStyles.borderTopColor;
													} else {
														td.style.borderColor = tdStyles.borderBottomColor;
													}

													if (sectionNumber > 0 && j % tableColumns == 0) {
														td.style.borderTopWidth = '5px';
													}

													tr.appendChild(td);
												}

												newTableTbody.appendChild(tr);
											}
										}
									} else {
										let newTableColumns;
										if (tableContainerWidth > 480) {
											for (let i = 0; i < tableColumns; i++) {
												newTableColumns = wholeColumnsInContainer - i;
												if (newTableColumns == 0) newTableColumns = 1;
												newTableLastSectionFilledColumns = tableColumns % newTableColumns;

												if (newTableLastSectionFilledColumns == 0) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumns > 0 &&
													newTableColumns <= 6 &&
													newTableColumns - 2 * newTableLastSectionFilledColumns <= 0 &&
													newTableLastSectionFilledColumns < newTableColumns
												) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumns > 6 &&
													newTableColumns <= 12 &&
													newTableColumns - 1.8 * newTableLastSectionFilledColumns <= 0 &&
													newTableLastSectionFilledColumns < newTableColumns
												) {
													valuesIsSaved = true;
													break;
												} else if (
													newTableColumns > 12 &&
													newTableColumns <= 18 &&
													newTableColumns - 1.6 * newTableLastSectionFilledColumns <= 0 &&
													newTableLastSectionFilledColumns < newTableColumns
												) {
													valuesIsSaved = true;
													break;
												} else {
													continue;
												}
											}
										} else {
											newTableColumns = 1;
											newTableLastSectionFilledColumns = 0;
											valuesIsSaved = true;
											newTable.column = 1;
										}

										const increaseRatioRows = Math.ceil(tableColumns / newTableColumns);

										const newTableRows = increaseRatioRows * tableRows;

										if (valuesIsSaved) {
											for (let i = 0; i < newTableRows; i++) {
												const sectionNumber = Math.floor(i / tableRows);
												const tr = document.createElement('tr');
												let jMax;
												let jStart;
												if (
													sectionNumber != increaseRatioRows - 1 ||
													newTableLastSectionFilledColumns == 0
												) {
													jStart = sectionNumber * newTableColumns;
													jMax = newTableColumns * (1 + sectionNumber);
												} else {
													jStart = tableColumns - newTableLastSectionFilledColumns;
													jMax = tableColumns;
												}
												const row = previewTable.rows[i - sectionNumber * tableRows];
												tr.classList = row.classList;
												tr.style.backgroundColor = row.style.backgroundColor;

												for (let j = jStart; j < jMax; j++) {
													const newTd = row.children[j].cloneNode(true);
													if (!newTd.style.backgroundColor) {
														const rowStyles = window.getComputedStyle(row);
														newTd.style.backgroundColor = rowStyles.backgroundColor;
													}
													newTd.style.width = null;
													newTd.style.height = null;
													// newTd.removeAttribute('data-x-index');
													newTd.removeAttribute('data-wptb-css-td-auto-width');
													tr.appendChild(newTd);
												}

												newTableTbody.appendChild(tr);
											}
										}
									}

									newTable.dataset.wholeColumnsInContainer = wholeColumnsInContainer;
									const images = newTable.querySelectorAll('[srcset]');
									if (images.length > 0) {
										for (let i = 0; i < images.length; i++) {
											images[i].removeAttribute('srcset');
										}
									}
									wptbPreviewTableMobile = newTable;
									tableContainer.appendChild(newTable);
									tableReconstructed = true;
								}
							}
						} else if (
							tableContainerMatrix &&
							tableContainerMatrix.classList.contains('wptb-matrix-hide')
						) {
							tableContainerMatrix.classList.remove('wptb-matrix-hide');
							tableReconstructed = true;
							previewTable.classList.remove('wptb-mobile-view-active');
							wptbPreviewTableMobile = tableContainer.querySelector('.wptb-preview-table-mobile');
							if (wptbPreviewTableMobile) {
								tableContainer
									.getElementsByClassName('wptb-preview-table-mobile')[0]
									.classList.add('wptb-mobile-hide');
							}
							tableContainer.style.overflow = 'auto';
						}
					} else {
						previewTable.style.minWidth = 'auto';
					}

					WPTB_RecalculateIndexes(previewTable);

					if (tableReconstructed) {
						WPTB_RecalculateIndexes(wptbPreviewTableMobile);
						const tabEvent = new CustomEvent('table:rebuilt', { detail: true, bubbles: true });
						previewTable.dispatchEvent(tabEvent);
					}
				}
			}
		}
	}

	function wptb_tdDefaultWidth() {
		const wptbTableContainers = document.getElementsByClassName('wptb-table-container');
		// let frontendEditLink = document.querySelectorAll( '.wptb-frontend-table-edit-link' );
		for (let i = 0; i < wptbTableContainers.length; i++) {
			const wptbTableContainer = wptbTableContainers[i];

			wptbTableContainer.classList.add(`wptb-table-container-${i}`);

			let table = wptbTableContainer.getElementsByClassName('wptb-preview-table');
			if (table.length > 0) {
				table = table[0];

				// added check for horizontal scroll functionality while adding max width property to table container style
				if (
					table.dataset.wptbTableContainerMaxWidth &&
					!table.dataset.wptbTableHorizontalScrollStatus &&
					!wptbTableContainer.dataset.wptbHorizontalScrollStatus
				) {
					wptbTableContainer.style.maxWidth = `${table.dataset.wptbTableContainerMaxWidth}px`;
				}
				table.classList.remove('wptb-table-preview-static-indic');

				table.mergingСellsHorizontally = false;
				const tds = table.querySelectorAll('td');
				for (let j = 0; j < tds.length; j++) {
					if (tds[j].colSpan > 1) {
						table.mergingСellsHorizontally = true;
					}
				}
				const wptbTableContainerWidth = wptbTableContainer.offsetWidth;

				const td = table.querySelector('td');
				const tdStyleObj = window.getComputedStyle(td, null);
				const tdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
				const tdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');
				const tdPaddingLeftWidth = tdStyleObj.getPropertyValue('padding-left');
				const tdPaddingRightWidth = tdStyleObj.getPropertyValue('padding-left');
				const tdPaddingCommon = parseFloat(tdPaddingLeftWidth, 10) + parseFloat(tdPaddingRightWidth, 10);
				const tableTdBorderCommonWidth = parseFloat(tdBorderLeftWidth, 10) + parseFloat(tdBorderRightWidth, 10);
				const { wptbTableTdsSumMaxWidth } = table.dataset;
				const { wptbFixedWidthSize } = table.dataset;
				const { wptbCellsWidthAutoCount } = table.dataset;
				let styleElementCreate = false;
				let tableTdWidthAuto;

				/**
				 * Table width logic to determine final width on rendered tables.
				 */
				const tableWidthLogic = () => {
					// eslint-disable-next-line no-shadow
					const wptbTableContainerWidth = wptbTableContainer.offsetWidth;
					if (wptbTableTdsSumMaxWidth < wptbTableContainerWidth) {
						if (wptbCellsWidthAutoCount) {
							table.style.minWidth = '100%';

							//                        if( frontendEditLink && frontendEditLink[i] ) {
							//                            frontendEditLink[i].style.minWidth = wptbTableTdsSumMaxWidth + 'px';
							//                        }

							if (table.mergingСellsHorizontally) {
								table.style.width = 'auto';
								const tableTdsWidthAutoCommon = wptbTableContainerWidth - wptbFixedWidthSize;
								tableTdWidthAuto = tableTdsWidthAutoCommon / wptbCellsWidthAutoCount;
								tableTdWidthAuto = tableTdWidthAuto - tdPaddingCommon - tableTdBorderCommonWidth;
								styleElementCreate = true;
							} else {
								table.style.width = '100%';

								//                            if( frontendEditLink && frontendEditLink[i] ) {
								//                                frontendEditLink[i].style.width = '100%';
								//                                frontendEditLink[i].style.maxWidth = '100%';
								//                            }
							}
						} else {
							table.style.width = 'auto';
							table.style.minWidth = null;
							table.style.maxWidth = `${wptbTableTdsSumMaxWidth}px`;

							//                        if( frontendEditLink && frontendEditLink[i] ) {
							//                            frontendEditLink[i].style.width = null;
							//                            frontendEditLink[i].style.minWidth = null;
							//                            frontendEditLink[i].style.maxWidth = wptbTableTdsSumMaxWidth + 'px';
							//                        }
						}
					} else {
						table.style.maxWidth = null;
						table.style.minWidth = `${table.dataset.wptbTableTdsSumMaxWidth}px`;
						table.style.width = 'auto';
						tableTdWidthAuto = table.dataset.wptbTdWidthAuto ? table.dataset.wptbTdWidthAuto : '100';
						styleElementCreate = true;

						//                    if( frontendEditLink && frontendEditLink[i] ) {
						//                        frontendEditLink[i].style.maxWidth = '100%';
						//                        frontendEditLink[i].style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
						//                        frontendEditLink[i].style.width = null;
						//                    }
					}
				};

				// if current table container width is equal or lower than zero, than it means it is hidden through css styles, width calculations should be done when it becomes visible again
				if (wptbTableContainerWidth <= 0) {
					/**
					 * Calculate element visibility status.
					 *
					 * @param {Element} element element to check
					 * @return {boolean} whether element is visible or not
					 */
					const elementVisibilityStatus = (element) => {
						const { display, visibility } = getComputedStyle(element);
						return display !== 'none' || visibility === 'visible';
					};

					/**
					 * Find parent element that is responsible for hiding our table.
					 *
					 * This function is recursive, it will keep searching parents till it hit 'body' element.
					 *
					 * @param {Element} currentElement current element in check
					 * @return {null|Element} found parent or null
					 */
					const findParentWithNoDisplay = (currentElement) => {
						const currentParent = currentElement.parentNode;
						const parentDisplayStatus = elementVisibilityStatus(currentParent);
						// lower cased element name
						const parentType = currentParent.nodeName.toLowerCase();

						// if parent is visible make a recursive call
						if (!parentDisplayStatus && parentType !== 'body') {
							return findParentWithNoDisplay(currentParent);
						}
						// hit body element, should return null to signal a problem with current DOM
						if (parentType === 'body') {
							return null;
						}
						return currentParent;
					};

					// find parent container with hidden display property
					const culpritParent = findParentWithNoDisplay(wptbTableContainer);
					if (culpritParent) {
						// setup a mutation observer to detect visibility change of parent which is responsible for hiding our table
						const config = { attributes: true, childList: false, subtree: false };
						const parentObserver = new MutationObserver((mutationRecord) => {
							try {
								// eslint-disable-next-line array-callback-return
								mutationRecord.map((mutation) => {
									const currentVisibility = elementVisibilityStatus(mutation.target);
									const { width: containerWidth } = mutation.target.getBoundingClientRect();

									// call width logic and start calculations for our table since it is visible now
									if (currentVisibility && containerWidth > 0) {
										tableWidthLogic();

										// disconnect observer
										parentObserver.disconnect();

										// get out of iteration
										throw new Error('get out of iteration');
									}
								});
							} catch (e) {
								// do nothing since an error is thrown to get out of array iteration
							}
						});

						// observe parent for visibility changes
						parentObserver.observe(culpritParent, config);
					}
				} else {
					// if no hidden parent element is found, it means our table is visible, continue normally
					tableWidthLogic();
				}

				const { head } = document;
				if (head) {
					const cssForTdsWidthAutoOld = head.querySelector(`style[data-wptb-td-auto-width-${i}="true"]`);

					if (cssForTdsWidthAutoOld) {
						head.removeChild(cssForTdsWidthAutoOld);
					}
				}

				if (styleElementCreate) {
					const cssForTdsWidthAuto = document.createElement('style');
					cssForTdsWidthAuto.setAttribute(`data-wptb-td-auto-width-${i}`, true);
					cssForTdsWidthAuto.innerHTML = `.wptb-table-container-${i} table td[data-wptb-css-td-auto-width=true]{width:${tableTdWidthAuto}px}`;
					if (head) {
						head.appendChild(cssForTdsWidthAuto);
					}
				}
			}
		}
	}

	window.addEventListener('resize', () => {
		wptb_tdDefaultWidth();
		wptb_tableReconstraction();
	});

	// code for adding of old css styles for correct view
	const elements = document.getElementsByClassName('wptb-ph-element');
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element.classList.contains('wptb-list-item-container')) {
			element.classList.remove('wptb-list-item-container');
			element.classList.add('wptb-list-container');
		}

		if (element.classList.contains('wptb-button-container')) {
			const infArr = element.className.match(/wptb-size-([A-Z]+)/i);
			if (infArr && Array.isArray(infArr)) {
				const wptbSize = infArr[0];
				const wptbSizeNew = wptbSize.toLowerCase();

				element.classList.remove(wptbSize);

				const wptbButtonWrapper = element.querySelector('.wptb-button-wrapper');
				if (wptbButtonWrapper) {
					wptbButtonWrapper.classList.add(wptbSizeNew);
				}
			}
		}
	}

	// responsive setup
	// eslint-disable-next-line no-unused-vars
	const responsiveFront = new WPTB_ResponsiveFrontend({
		query: '.wptb-preview-table',
		bindToResize: true,
	});

	// eslint-disable-next-line no-restricted-globals
	const context = self || global;

	// assign responsive front instance to global context
	context.wptbResponsiveFrontendInstance = responsiveFront;

	// sorting table
	function sortingTable() {
		const tables = document.querySelectorAll('.wptb-preview-table');
		for (let i = 0; i < tables.length; i += 1) {
			const sortableTable = new WPTB_SortableTable({ table: tables[i] });
			sortableTable.sortableTableInitialization(responsiveFront);
		}
	}

	const textIconFrontendEditFix = () => {
		const tableObjects = WptbFrontendBase.getTableObjects();

		tableObjects.map(({ mainTable }) => {
			const textIconElements = Array.from(mainTable.querySelectorAll('.wptb-text_icon_element-container'));

			textIconElements.map((tiEl) => {
				tiEl.setAttribute('contenteditable', false);
			});
		});
	};

	const badgeFrontendEditFix = () => {
		const tableObjects = WptbFrontendBase.getTableObjects();

		tableObjects.map(({ mainTable }) => {
			const textIconElements = Array.from(mainTable.querySelectorAll('.wptb-badge-container'));

			textIconElements.map((tiEl) => {
				tiEl.setAttribute('contenteditable', false);
			});
		});
	};

	sortingTable();
	const responsiveFrontReady = new CustomEvent('responsive:front', {
		detail: {
			responsiveFront,
		},
	});
	document.dispatchEvent(responsiveFrontReady);

	// initialize scroll manager
	new WPTB_ScrollManager(WptbFrontendData.scrollManager).init();

	// apply defined extra styles to tables if there is any
	WPTB_ExtraStyles.applyStyles(WPTB_ExtraStyles.modes.frontEnd, WptbFrontendData.generalStyles);

	// rebuild tables according to current responsive mode
	responsiveFront.rebuildTables();

	// initialize lazy load module
	WPTB_LazyLoad.init(WptbFrontendData.lazyLoad);

	textIconFrontendEditFix();
    badgeFrontendEditFix();

	// initialize style pass
	WPTB_StylePass.init(WptbFrontendData.stylePass);
});
