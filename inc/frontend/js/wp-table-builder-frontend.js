function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_CutGlueTable = {
    cutTableHorizontally: function cutTableHorizontally(rowBefore, table) {
        if (table && table.rows[rowBefore]) {
            for (var i = 0; i < rowBefore; i++) {
                var tableRowsIChildren = table.rows[i].children;

                for (var j = 0; j < tableRowsIChildren.length; j++) {
                    if (tableRowsIChildren[j].rowSpan > 1 && tableRowsIChildren[j].rowSpan > rowBefore - i) {
                        var newTdRowspan = tableRowsIChildren[j].rowSpan - rowBefore + i;
                        tableRowsIChildren[j].rowSpan = rowBefore - i;
                        if (!tableRowsIChildren[j].dataset.sameCellBeforeDivision) {
                            tableRowsIChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                        }

                        var td = void 0;
                        if (table.hasOwnProperty('wptbCell')) {
                            td = new table.wptbCell(table.mark);
                            td = td.getDOMElement();
                        } else {
                            td = document.createElement('td');
                        }

                        var tdTopStyle = tableRowsIChildren[j].getAttribute('style');
                        td.setAttribute('style', tdTopStyle);
                        td.colSpan = tableRowsIChildren[j].colSpan;
                        td.rowSpan = newTdRowspan;
                        td.dataset.sameCellBeforeDivision = tableRowsIChildren[j].dataset.sameCellBeforeDivision;

                        var dataXIndex = tableRowsIChildren[j].dataset.xIndex;
                        var dataXIndexNext = parseInt(dataXIndex) + parseInt(tableRowsIChildren[j].colSpan);
                        var beforeTd = void 0;
                        while (!beforeTd && dataXIndexNext < table.maxCols) {
                            beforeTd = table.rows[rowBefore].querySelector('[data-x-index="' + dataXIndexNext + '"]');
                            dataXIndexNext++;
                        }
                        table.rows[rowBefore].insertBefore(td, beforeTd);

                        WPTB_RecalculateIndexes(table);
                    }
                }
            }
        }
    },
    glueTableHorizontally: function glueTableHorizontally(table) {
        if (table) {
            var tds = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].hasAttribute('data-same-cell-before-division')) {
                    var dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    var tdsSameBeforeDivision = table.querySelectorAll('[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]');
                    for (var j = 0; j < tdsSameBeforeDivision.length; j++) {
                        if (tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1]) {
                            if (tdsSameBeforeDivision[j].parentNode && tdsSameBeforeDivision[j + 1].parentNode && !tdsSameBeforeDivision[j].parentNode.classList.contains('wptb-row-moving') && !tdsSameBeforeDivision[j + 1].parentNode.classList.contains('wptb-row-moving')) {
                                if (tdsSameBeforeDivision[j + 1].dataset.yIndex == parseInt(tdsSameBeforeDivision[j].dataset.yIndex) + parseInt(tdsSameBeforeDivision[j].rowSpan)) {
                                    tdsSameBeforeDivision[j].rowSpan += tdsSameBeforeDivision[j + 1].rowSpan;

                                    var tdsSameBeforeDivisionJPlusChildren = [].concat(_toConsumableArray(tdsSameBeforeDivision[j + 1].children));

                                    for (var k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++) {
                                        tdsSameBeforeDivision[j].appendChild(tdsSameBeforeDivisionJPlusChildren[k]);
                                    }

                                    var nextRow = tdsSameBeforeDivision[j + 1].parentNode;
                                    nextRow.removeChild(tdsSameBeforeDivision[j + 1]);
                                }
                            }
                        }
                    }
                }
            }

            WPTB_RecalculateIndexes(table);
        }
    },
    cutTableVertically: function cutTableVertically(col, table) {
        for (var i = 0; i < table.rows.length; i++) {
            if (col < table.maxCols) {
                if (col != 0 && !table.rows[i].querySelector('[data-x-index="' + col + '"]')) {
                    var rowChildren = table.rows[i].children;

                    var td = void 0,
                        rowChildrenLength = rowChildren.length,
                        afterTd = void 0,
                        rowSpanNewTd = void 0,
                        colSpanOld = void 0,
                        colSpanNewTd = void 0;
                    for (var j = 0; j < rowChildrenLength; j++) {
                        if (rowChildren[j].colSpan > 1 && parseInt(rowChildren[j].dataset.xIndex) < col && parseInt(rowChildren[j].dataset.xIndex) + parseInt(rowChildren[j].colSpan) > col) {
                            if (table.hasOwnProperty('wptbCell')) {
                                td = new table.wptbCell(table.mark);
                                td = td.getDOMElement();
                            } else {
                                td = document.createElement('td');
                            }

                            rowSpanNewTd = rowChildren[j].rowSpan;
                            colSpanOld = rowChildren[j].colSpan;
                            rowChildren[j].colSpan = col - rowChildren[j].dataset.xIndex;
                            colSpanNewTd = colSpanOld - rowChildren[j].colSpan;

                            if (!rowChildren[j].dataset.sameCellBeforeDivision) {
                                rowChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                            }

                            var tdLeftStyle = rowChildren[j].getAttribute('style');
                            td.setAttribute('style', tdLeftStyle);

                            var tdAnalogThisX = table.querySelector('[data-x-index="' + col + '"]');
                            if (tdAnalogThisX) {
                                td.style.width = tdAnalogThisX.style.width;
                            }

                            var tdAnalogThisY = table.querySelector('[data-y-index="' + i + '"]');
                            if (tdAnalogThisY) {
                                td.style.height = tdAnalogThisY.style.height;
                            }
                            if (rowChildren[j + 1]) {
                                afterTd = rowChildren[j + 1];
                            } else {
                                afterTd = null;
                            }

                            table.rows[i].insertBefore(td, afterTd);
                            td.colSpan = colSpanNewTd;
                            td.rowSpan = rowSpanNewTd;
                            td.dataset.sameCellBeforeDivision = rowChildren[j].dataset.sameCellBeforeDivision;
                            i += rowSpanNewTd - 1;
                            break;
                        }
                    }
                }
            }
            WPTB_RecalculateIndexes(table);
        }
    },
    glueTableVertically: function glueTableVertically(table) {
        if (table) {
            var tds = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].hasAttribute('data-same-cell-before-division')) {
                    var dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    var tdsSameBeforeDivision = [].concat(_toConsumableArray(table.querySelectorAll('[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]')));

                    var jFirstTdGlue = null;
                    for (var j = 0; j < tdsSameBeforeDivision.length; j++) {
                        if (tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1] && !tdsSameBeforeDivision[j].classList.contains('wptb-column-moving') && !tdsSameBeforeDivision[j + 1].classList.contains('wptb-column-moving')) {
                            if (tdsSameBeforeDivision[j + 1].dataset.xIndex == parseInt(tdsSameBeforeDivision[j].dataset.xIndex) + parseInt(tdsSameBeforeDivision[j].colSpan)) {
                                if (jFirstTdGlue == null) {
                                    jFirstTdGlue = j;
                                }
                                tdsSameBeforeDivision[jFirstTdGlue].colSpan += tdsSameBeforeDivision[j + 1].colSpan;

                                var tdsSameBeforeDivisionJPlusChildren = [].concat(_toConsumableArray(tdsSameBeforeDivision[j + 1].children));

                                for (var k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++) {
                                    tdsSameBeforeDivision[jFirstTdGlue].appendChild(tdsSameBeforeDivisionJPlusChildren[k]);
                                }

                                var thisRow = tdsSameBeforeDivision[j + 1].parentNode;
                                thisRow.removeChild(tdsSameBeforeDivision[j + 1]);
                            }
                        }
                    }
                }
            }

            WPTB_RecalculateIndexes(table);
        }
    }
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_SortableTable = function WPTB_SortableTable(table) {
	this.table = table;
	var thisObject = this;
	this.topRow = table.rows.length ? table.rows[0] : null;
	this.itemsPerHeader = 0;

	/**
  * sets the table to sort mode
  * @param {string} type
  * @param {boolean} active
  * @param {number} number
  */
	this.sortModeSwitcher = function (type, active, number) {
		if (type === 'vertical') {
			this.table.removeEventListener('click', this.sortableTableVerticalStart, false);

			if (active) {
				this.sortModeSwitcher('horizontal', false);
				this.sortingCellMouseMoveSwitcher('vertical', true);
				this.table.addEventListener('click', this.sortableTableVerticalStart, false);
				this.table.dataset.wptbSortableTableVertical = '1';
			} else {
				this.sortingCellMouseMoveSwitcher('vertical', false);
				delete this.table.dataset.wptbSortableTableVertical;
			}
		} else if (type === 'horizontal') {
			this.table.removeEventListener('click', this.sortableTableHorizontalStart, false);

			if (active) {
				this.sortModeSwitcher('vertical', false);
				this.sortingCellMouseMoveSwitcher('horizontal', true);
				this.table.addEventListener('click', this.sortableTableHorizontalStart, false);
				this.table.dataset.wptbSortableTableHorizontal = '1';
			} else {
				this.sortingCellMouseMoveSwitcher('horizontal', false);
				delete this.table.dataset.wptbSortableTableHorizontal;
			}
		}
	};

	/**
  * checks whether the table should be in the sort state
  * and connects the necessary handlers
  *
  * @param {object} responsiveFront
  */
	this.sortableTableInitialization = function (responsiveFront) {
		var type = '';
		var typeFirst = void 0;
		var typeSecond = void 0;
		if (this.table.dataset.wptbSortableTableVertical && this.table.dataset.wptbSortableTableVertical === '1') {
			typeFirst = 'vertical';
			typeSecond = 'horizontal';
		} else if (this.table.dataset.wptbSortableTableHorizontal && this.table.dataset.wptbSortableTableHorizontal === '1') {
			typeFirst = 'horizontal';
			typeSecond = 'vertical';
		}

		var switchMode = void 0;
		if (responsiveFront && responsiveFront.getDirective(this.table)) {
			switchMode = function switchMode() {
				var size = void 0;
				var directives = responsiveFront.getDirective(this.table);
				if (directives && directives.relativeWidth) {
					switch (directives.relativeWidth) {
						case 'window':
							// eslint-disable-next-line no-param-reassign
							size = window.innerWidth;
							break;
						case 'container':
							// get the size of the container table is in
							// eslint-disable-next-line no-param-reassign
							size = o.el.parentNode.parentNode.parentNode.clientWidth;
							break;
						default:
							// eslint-disable-next-line no-param-reassign
							size = window.innerWidth;
							break;
					}
				} else {
					size = this.table.getBoundingClientRect().width;
				}
				var sizeRangeId = responsiveFront.calculateRangeId(size, directives.breakpoints);
				type = typeFirst;
				if (sizeRangeId !== 'desktop') {
					if (directives.hasOwnProperty('modeOptions')) {
						var mode = directives.responsiveMode;
						var modeOptions = directives.modeOptions[mode];

						if (modeOptions.hasOwnProperty('topRowAsHeader') && modeOptions.topRowAsHeader.hasOwnProperty(sizeRangeId) && modeOptions.topRowAsHeader[sizeRangeId]) {
							if (modeOptions.hasOwnProperty('cellStackDirection') && modeOptions.cellStackDirection.hasOwnProperty(sizeRangeId)) {
								if (modeOptions.cellStackDirection[sizeRangeId] === 'row') {
									type = typeSecond;
								} else if (modeOptions.cellStackDirection[sizeRangeId] === 'column') {
									if (modeOptions.hasOwnProperty('cellsPerRow')) {
										this.itemsPerHeader = modeOptions.cellsPerRow[sizeRangeId];
									}
								}
							}
						}
					}
				}
				this.sortModeSwitcher(type, true);
			};
		} else {
			switchMode = function switchMode() {
				var type = typeFirst;
				if (this.table.classList.contains('wptb-mobile-view-active')) {
					if (this.table.classList.contains('wptb-table-preview-head')) {
						type = typeSecond;
					}
					var _table = this.table;
					this.table = _table.parentNode.parentNode.querySelector('.wptb-preview-table-mobile');
					this.sortModeSwitcher(type, true);
					this.table = _table;
					return;
				}

				this.sortModeSwitcher(type, true);
			};
		}

		switchMode.call(thisObject);
		this.table.addEventListener('table:rebuilt', function (e) {
			switchMode.call(thisObject);
		}, false);
	};

	/**
  * adds and deletes mousemove and mouseleave events handlers when happens switch sorting mode
  * and also can add necessary attributes
  *
  * @param {string} type
  * @param {boolean} active
  */
	this.sortingCellMouseMoveSwitcher = function (type, active) {
		if (type === 'vertical') {
			var rowsLength = this.table.rows.length;
			var dataYIndexStart = 0;
			while (rowsLength > 0) {
				var tds = this.table.querySelectorAll('[data-y-index="' + dataYIndexStart + '"]');
				tds = [].concat(_toConsumableArray(tds));
				tds.map(function (td) {
					td.removeEventListener('mousemove', sortingCellMouseMoveVertical, false);
					td.removeEventListener('mouseleave', tdMouseLeave, false);
					if (active) {
						td.addEventListener('mousemove', sortingCellMouseMoveVertical, false);
						td.addEventListener('mouseleave', tdMouseLeave, false);
						if (!td.dataset.sortedVertical) {
							td.dataset.sortedVertical = 'ask';
						}
					}
				});

				if (this.itemsPerHeader) {
					rowsLength -= this.itemsPerHeader + 1;
					dataYIndexStart += this.itemsPerHeader + 1;
				} else {
					rowsLength = 0;
				}
			}
		} else if (type === 'horizontal') {
			var _tds = this.table.querySelectorAll('[data-x-index="0"]');
			_tds = [].concat(_toConsumableArray(_tds));
			_tds.map(function (td) {
				td.removeEventListener('mousemove', sortingCellMouseMoveHorizontal, false);
				td.removeEventListener('mouseleave', tdMouseLeave, false);
				if (active) {
					td.addEventListener('mousemove', sortingCellMouseMoveHorizontal, false);
					td.addEventListener('mouseleave', tdMouseLeave, false);
				}
			});
		}
	};

	/**
  * adds a sortable-hover class for a cell when the cursor is over the sort icon (arrow)
  *
  * @param {event} e
  * @param {string} type
  * @param {HTMLElement} element td
  */
	function sortingCellMouseMov(e, type, element) {
		if (e.target.tagName === 'TD') {
			var x = e.offsetX == undefined ? e.layerX : e.offsetX;
			var y = e.offsetY == undefined ? e.layerY : e.offsetY;
			var xMatch = false;
			if (type === 'vertical' && e.target.clientWidth - x <= 35 || type === 'horizontal' && x <= 35) {
				xMatch = true;
			}
			if (xMatch && (e.target.clientHeight - 35) / 2 < y && (e.target.clientHeight + 35) / 2 > y) {
				element.classList.add('sortable-hover');
			} else {
				element.classList.remove('sortable-hover');
			}
		} else {
			element.classList.remove('sortable-hover');
		}
	}

	/**
  * calls sortingCellMouseMov with the type parameter set to vertical
  *
  * @param {event} e
  */
	function sortingCellMouseMoveVertical(e) {
		sortingCellMouseMov(e, 'vertical', this);
	}

	/**
  * calls sortingCellMouseMov with the type parameter set to horizontal
  *
  * @param {event} e
  */
	function sortingCellMouseMoveHorizontal(e) {
		sortingCellMouseMov(e, 'horizontal', this);
	}

	/**
  * remove sortable-hover class from cell when cursor leave cell
  */
	function tdMouseLeave() {
		this.classList.remove('sortable-hover');
	}

	/**
  * function for sorting the table vertically by the numeric content of cells
  *
  * @param {event} e
  * @param {HTMLElement} table
  * @param {string} type
  */
	function sortableTable(e, table, type) {
		if (e.target && e.target.tagName === 'TD' && !table.parentNode.classList.contains('wptb-preview-table-manage-cells')) {
			var tableWasSorted = false;
			if (type === 'vertical' && e.target.dataset.hasOwnProperty('sortedVertical')) {

				/**
     * if table have enabled param topRowAsHeader and sellsStackDirection is column
     * the top and bottom rows that will not be sorted are temporarily removed from the table
     */
				var tableRowsBefore = [];
				var tableRowsAfter = [];
				if (this.itemsPerHeader && this.itemsPerHeader < table.rows.length) {
					WPTB_RecalculateIndexes(table);
					var tableRowsArr = [].concat(_toConsumableArray(table.rows));
					var tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					for (var i = 0; i < tableRowsArr.length; i++) {
						if (i < e.target.dataset.yIndex) {
							tableRowsBefore.push(tableRowsArr[i]);
							tableLastCont.removeChild(tableRowsArr[i]);
						} else if (i > e.target.dataset.yIndex + this.itemsPerHeader) {
							tableRowsAfter.push(tableRowsArr[i]);
							tableLastCont.removeChild(tableRowsArr[i]);
						}
					}
					WPTB_RecalculateIndexes(table);
				}

				var tds = table.querySelectorAll('[data-x-index="' + e.target.dataset.xIndex + '"]');
				tds = [].concat(_toConsumableArray(tds));

				/**
     * preparing table for sorting
     */
				var rowspan = void 0;
				var rowNum = void 0;
				tds.map(function (td) {
					if (!(rowspan = parseInt(td.rowSpan, 10))) {
						rowspan = 1;
					}
					rowNum = td.dataset.yIndex;
					WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
					rowNum += rowspan;
					WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
				});

				var rowsValuesArr = [];
				var rowsTdFirst = void 0;
				var tdYCoordsRowSpanPrevious = 0;
				var tableRowsPushed = [];
				for (var _i = 0; _i < tds.length; _i++) {
					var tdsChanged = changeSortingTdsCollection(e, table, tds, _i, tdYCoordsRowSpanPrevious, 'vertical');
					if (tdsChanged && tdsChanged.hasOwnProperty('i')) {
						tds = tdsChanged.tds;
						_i = tdsChanged.i;
						continue;
					} else if (tdsChanged) {
						tds = tdsChanged.tds;
					}

					var td = tds[_i];

					var tdRowspan = parseInt(td.rowSpan, 10);
					if (!tdRowspan) tdRowspan = 1;

					tdYCoordsRowSpanPrevious = parseInt(td.dataset.yIndex, 10) + tdRowspan;

					var textElementsValues = textElementsValuesGet(td);

					var rowsTd = [];
					for (var j = 0; j < tdRowspan; j++) {
						rowsTd.push(table.rows[parseInt(td.dataset.yIndex, 10) + j]);
						tableRowsPushed.push(parseInt(td.dataset.yIndex, 10) + j);
					}
					if (td.dataset.yIndex > 0) {
						rowsValuesArr.push({
							rowsTd: rowsTd,
							value: textElementsValues
						});
					} else {
						rowsTdFirst = rowsTd;
					}
				}

				var orderBy = setSortedAscDataAttr(e, 'sortedVertical');
				if (!orderBy) return;

				if (rowsValuesArr.length) rowsValuesArr.sort(function (prev, next) {
					return sortOrder(orderBy, prev, next);
				});

				rowsValuesArr.unshift({ rowsTd: rowsTdFirst });

				if (rowsValuesArr.length < table.rows.length) {
					for (var _i2 = 0; _i2 < table.rows.length; _i2++) {
						if (tableRowsPushed.indexOf(_i2) > -1) continue;
						var _rowsTd = [];
						_rowsTd.push(table.rows[_i2]);

						rowsValuesArr.push({
							rowsTd: _rowsTd
						});
					}
				}

				var tBody = table.querySelector('tbody');
				tBody.innerHTML = '';

				rowsValuesArr.map(function (rowsValObj) {
					rowsValObj.rowsTd.map(function (row) {
						tBody.appendChild(row);
					});
				});

				/**
     * returning previously deleted rows
     */
				if (tableRowsBefore.length) {
					var _tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					if (_tableLastCont) {
						var trRef = _tableLastCont.querySelector('tr');
						tableRowsBefore.map(function (tr) {
							_tableLastCont.insertBefore(tr, trRef);
						});
					}
				}
				if (tableRowsAfter.length) {
					var _tableLastCont2 = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					if (tBody) {
						tableRowsAfter.map(function (tr) {
							_tableLastCont2.appendChild(tr);
						});
					}
				}

				WPTB_RecalculateIndexes(table);

				WPTB_CutGlueTable.glueTableHorizontally(table);

				tableWasSorted = true;
			} else if (type === 'horizontal' && e.target.dataset.xIndex === '0') {
				var _tds2 = table.querySelectorAll('[data-y-index="' + e.target.dataset.yIndex + '"]');
				_tds2 = [].concat(_toConsumableArray(_tds2));

				// preparing table for sorting
				var colspan = void 0;
				var colNum = void 0;
				_tds2.map(function (td) {
					if (!(colspan = parseInt(td.colSpan, 10))) {
						colspan = 1;
					}
					colNum = td.dataset.xIndex;
					WPTB_CutGlueTable.cutTableVertically(colNum, table);
					colNum += colspan;
					WPTB_CutGlueTable.cutTableVertically(colNum, table);
				});

				var columnsValuesArr = [];
				var columnsTdFirst = void 0;

				var tdXCoordsColSpanPrevious = 0;
				for (var _i3 = 0; _i3 < _tds2.length; _i3++) {
					var _tdsChanged = changeSortingTdsCollection(e, table, _tds2, _i3, tdXCoordsColSpanPrevious, 'horizontal');
					if (_tdsChanged && _tdsChanged.hasOwnProperty('i')) {
						_tds2 = _tdsChanged.tds;
						_i3 = _tdsChanged.i;
						continue;
					} else if (_tdsChanged) {
						_tds2 = _tdsChanged.tds;
					}

					var _td = _tds2[_i3];
					var tdColspan = parseInt(_td.colSpan, 10);
					if (!tdColspan) tdColspan = 1;

					tdXCoordsColSpanPrevious = parseInt(_td.dataset.xIndex, 10) + tdColspan;

					var _textElementsValues = textElementsValuesGet(_td);
					var columnsTd = [];
					for (var _j = 0; _j < tdColspan; _j++) {
						var tdsColumn = [].concat(_toConsumableArray(table.querySelectorAll('[data-x-index="' + (parseInt(_td.dataset.xIndex, 10) + _j) + '"]')));
						columnsTd.push(tdsColumn);
					}
					if (_td.dataset.xIndex > 0) {
						columnsValuesArr.push({
							columnsTd: columnsTd,
							value: _textElementsValues
						});
					} else {
						columnsTdFirst = columnsTd;
					}
				}

				var _orderBy = setSortedAscDataAttr(e, 'sortedHorizontal');
				if (!_orderBy) return;

				if (columnsValuesArr.length) columnsValuesArr.sort(function (prev, next) {
					return sortOrder(_orderBy, prev, next);
				});

				columnsValuesArr.unshift({ columnsTd: columnsTdFirst });

				if (columnsValuesArr.length < table.maxCols) {
					var difference = table.maxCols - columnsValuesArr.length;
					for (var _i4 = 0; _i4 < difference; _i4++) {
						var _tdsColumn = [].concat(_toConsumableArray(table.querySelectorAll('[data-x-index="' + (parseInt(table.maxCols, 10) - parseInt(difference, 10) + _i4) + '"]')));

						columnsValuesArr.push({
							columnsTd: [_tdsColumn]
						});
					}
				}

				for (var _i5 = 0; _i5 < table.rows.length; _i5++) {
					table.rows[_i5].innerHTML = '';
				}

				columnsValuesArr.map(function (columnsValObj) {
					columnsValObj.columnsTd.map(function (tdsColumn) {
						tdsColumn.map(function (td) {
							table.rows[td.dataset.yIndex].appendChild(td);
						});
					});
				});

				WPTB_RecalculateIndexes(table);

				WPTB_CutGlueTable.glueTableVertically(table);

				tableWasSorted = true;
			}

			if (tableWasSorted) {
				removeCellsAttrAfterDivision(table);

				if (table.hasOwnProperty('tableSM')) {
					var tableSM = table.tableSM();
					new tableSM().tableStateSet();
				}
			}
		}
	}

	/**
  * Function that sets the data-attribute with the number of the row or column
  * that the table was sorted by. Returns the number of a row or column
  *
  * @param {event} e
  * @param {string} dataAttr
  * @returns {null|boolean}
  */
	function setSortedAscDataAttr(e, dataAttr) {
		if (e.currentTarget && (e.currentTarget.classList.contains('wptb-preview-table') || e.currentTarget.classList.contains('wptb-preview-table-mobile'))) {
			if (!e.target.dataset[dataAttr] || e.target.dataset[dataAttr] === 'ask') {
				e.target.dataset[dataAttr] = 'desk';
			} else {
				e.target.dataset[dataAttr] = 'ask';
			}

			return e.target.dataset[dataAttr];
		}

		return false;
	}

	/**
  * defines the sorting order
  *
  * @param {string} orderBy
  * @param prev
  * @param next
  * @returns {number}
  */
	function sortOrder() {
		var orderBy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ask';
		var prev = arguments[1];
		var next = arguments[2];

		var prevValue = prev.value;
		var nextValue = next.value;
		if (parseInt(prevValue) && parseInt(nextValue)) {
			prevValue = parseInt(prevValue);
			nextValue = parseInt(nextValue);
		}

		if (orderBy === 'ask') {
			if (prevValue < nextValue) {
				return -1;
			}
			if (prevValue === nextValue) {
				return 0;
			}
			return 1;
		}
		if (prevValue < nextValue) {
			return 1;
		}
		if (prevValue === nextValue) {
			return 0;
		}
		return -1;
	}

	/**
  * return cell text elements values
  *
  * @param cell {HTMLElement}
  * @returns {string}
  */
	function textElementsValuesGet(cell) {
		var textElements = cell.querySelectorAll('.wptb-text-container');
		textElements = [].concat(_toConsumableArray(textElements));
		var value = '';
		for (var j = 0; j < textElements.length; j++) {
			var p = textElements[j].querySelector('p');
			value += p.innerText;
			if (j !== textElements.length - 1) value += ' ';
		}

		return value;
	}

	/**
  * adds cells to the collection of cells in the row or column that the table is sorted by.
  * These added cells are not originally were added in the collection,
  * because they are combined with cells from higher rows or left-side columns
  *
  * @param {event} e
  * @param {HTMLElement} table
  * @param {array} tds
  * @param {number} i
  * @param {number} tdIndexSpanPrev
  * @param {string} type
  * @returns {{tds: *}|boolean|{tds: *, i: *}}
  */
	function changeSortingTdsCollection(e, table, tds, i, tdIndexSpanPrev, type) {
		var td = tds[i];
		var tdsCollectionChanged = false;
		var collectionTds = void 0;
		var collectionTdsJSpan = void 0;
		var collectionTdsJSpanProperty = void 0;
		var indexName = void 0;
		var indexNameCamelCase = void 0;
		var indexNamePerpendicularCamelCase = void 0;
		var tdSpanProperty = void 0;
		// max rows or columns column
		var tableGroupCount = void 0;

		if (type === 'vertical') {
			collectionTdsJSpanProperty = 'colSpan';
			indexName = 'data-y-index';
			indexNameCamelCase = 'yIndex';
			indexNamePerpendicularCamelCase = 'xIndex';
			tdSpanProperty = 'rowSpan';
			tableGroupCount = table.rows.length;
		} else if (type === 'horizontal') {
			collectionTdsJSpanProperty = 'rowSpan';
			indexName = 'data-x-index';
			indexNameCamelCase = 'xIndex';
			indexNamePerpendicularCamelCase = 'yIndex';
			tdSpanProperty = 'colSpan';
			tableGroupCount = table.maxCols;
		}

		if (td.dataset[indexNameCamelCase] - tdIndexSpanPrev > 0) {
			collectionTds = table.querySelectorAll('[' + indexName + '="' + tdIndexSpanPrev + '"]');

			for (var j = 0; j < collectionTds.length; j++) {
				collectionTdsJSpan = collectionTds[j][collectionTdsJSpanProperty];
				if (!collectionTdsJSpan) collectionTdsJSpan = 1;

				if (collectionTds[j].dataset[indexNamePerpendicularCamelCase] < e.target.dataset[indexNamePerpendicularCamelCase] && parseInt(collectionTds[j].dataset[indexNamePerpendicularCamelCase], 10) + parseInt(collectionTdsJSpan, 10) > e.target.dataset[indexNamePerpendicularCamelCase]) {
					tds.splice(i, 0, collectionTds[j]);
					tdsCollectionChanged = true;
					i--;
					break;
				}
			}
		}

		if (tdsCollectionChanged) return { tds: tds, i: i };

		var tdSpan = parseInt(td[tdSpanProperty], 10);
		if (!tdSpan) tdSpan = 1;
		if (i == tds.length - 1 && parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan < tableGroupCount) {
			collectionTds = table.querySelectorAll('[' + indexName + '="' + (parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan) + '"]');
			for (var _j2 = 0; _j2 < collectionTds.length; _j2++) {
				collectionTdsJSpan = collectionTds[_j2][collectionTdsJSpanProperty];
				if (!collectionTdsJSpan) collectionTdsJSpan = 1;

				if (collectionTds[_j2].dataset[indexNamePerpendicularCamelCase] < e.target.dataset[indexNamePerpendicularCamelCase] && parseInt(collectionTds[_j2].dataset[indexNamePerpendicularCamelCase], 10) + parseInt(collectionTdsJSpan, 10) > e.target.dataset[indexNamePerpendicularCamelCase]) {
					tds.push(collectionTds[_j2]);
					tdsCollectionChanged = true;
					break;
				}
			}
		}

		if (tdsCollectionChanged) return { tds: tds };
		return false;
	}

	/**
  * remove cells attributes which were used for division table
  *
  * @param {HTMLElement} table
  */
	function removeCellsAttrAfterDivision(table) {
		var tdsAll = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
		for (var i = 0; i < tdsAll.length; i++) {
			if (tdsAll[i].hasAttribute('data-same-cell-before-division')) {
				tdsAll[i].removeAttribute('data-same-cell-before-division');
			}
		}
	}

	/**
  * function for run sorting table vertically
  *
  * @param {event} e
  */
	this.sortableTableVerticalStart = function (e) {
		sortableTable.call(thisObject, e, table, 'vertical');
	};

	/**
  * function for run sorting table horizontally
  *
  * @param {event} e
  */
	this.sortableTableHorizontalStart = function (e) {
		sortableTable.call(thisObject, e, table, 'horizontal');
	};
};
var WPTB_RecalculateIndexes = function WPTB_RecalculateIndexes(table) {
    var trs = table.getElementsByTagName('tr'),
        tds = void 0,
        maxCols = 0,
        maxColsFull = 0,
        tdsArr = [];

    for (var i = 0; i < trs.length; i++) {
        tds = trs[i].getElementsByTagName('td');

        if (tdsArr[i] == undefined) {
            tdsArr[i] = [];
        }

        var jMainIter = 0;
        for (var j = 0; j < tds.length; j++) {
            if (tdsArr[i][j] != undefined) {
                for (var y = 0; y < 100; y++) {
                    if (tdsArr[i][jMainIter] != undefined) {
                        jMainIter++;
                        continue;
                    }
                    tdsArr[i][jMainIter] = tds[j];
                    tds[j].dataset.xIndex = jMainIter;
                    break;
                }
            } else {
                tdsArr[i][j] = tds[j];
                tds[j].dataset.xIndex = jMainIter;
            }
            tds[j].dataset.yIndex = i;

            if (tds[j].colSpan > 1) {
                for (var k = 1; k < tds[j].colSpan; k++) {
                    jMainIter++;
                    tdsArr[i][jMainIter] = 'tdDummy';
                }
            }

            if (tds[j].rowSpan > 1) {
                for (var x = 1; x < tds[j].rowSpan; x++) {
                    if (tdsArr[i + x] == undefined) {
                        tdsArr[i + x] = [];
                    }
                    for (var z = 0; z < tds[j].colSpan; z++) {
                        tdsArr[i + x][jMainIter - tds[j].colSpan + 1 + z] = 'tdDummy';
                    }
                }
            }
            jMainIter++;
        }

        if (tds.length > maxCols) {
            maxCols = tds.length;
        }

        if (i == 0) {
            maxColsFull = jMainIter;
        }
    }
    table.columns = maxCols;
    table.maxCols = maxColsFull;
};
(function ($) {
	/**
  * All of the code for your public-facing JavaScript source
  * should reside in this file.
  *
  * Note: It has been assumed you will write jQuery code here, so the
  * $ function reference has been prepared for usage within the scope
  * of this function.
  *
  * This enables you to define handlers, for when the DOM is ready:
  *
  * $(function() {
  *
  * });
  *
  * When the window is loaded:
  *
  * $( window ).load(function() {
  *
  * });
  *
  * ...and/or other possibilities.
  *
  * Ideally, it is not considered best practise to attach more than a
  * single DOM-ready or window-load handler for a particular page.
  * Although scripts in the WordPress core, Plugins and Themes may be
  * practising this, we should strive to set a better example in our own work.
  *
  * The file is enqueued from inc/frontend/class-frontend.php.
  */

	jQuery(document).ready(function ($) {
		var tableContainers = document.getElementsByClassName('wptb-table-container');
		/**
   * Adds hover color change support for supported button elements.
   */
		function addHoverSupport(querySelector) {
			var buttons = Array.from(document.querySelectorAll(querySelector));

			buttons.map(function (b) {
				b.addEventListener('mouseenter', function (e) {
					var el = e.target;
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
						el.style.transform = 'scale(' + b.dataset.wptbElementHoverScale + ')';
					}
				});

				b.addEventListener('mouseleave', function (e) {
					// reset all supported hover properties to their default value
					var el = e.target;
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

		/**
   * function wptb_tableContainerSectionSmall
   * add class ( wptb-section-small ) in small width
   * remove this class in large width
   * @returns {void}
   */
		function wptb_tableContainerSectionSmall() {
			var wptbTableContainer = jQuery('.wptb-table-container');
			var sw = wptbTableContainer.width();
			if (wptbTableContainer.length > 0) {
				if (sw < 480) {
					wptbTableContainer.addClass('wptb-section-small');
				} else {
					wptbTableContainer.removeClass('wptb-section-small');
				}
			}
		}

		/**
   * function wptb_tableGenerateMobile
   * generates a mobile view of the table
   * when the top row of the table is not a heading
   * @returns {void}
   */
		function wptb_tableGenerateMobile() {
			var wptbTableContainer = document.getElementsByClassName('wptb-table-container');
			var wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
			var wptbPreviewTableMobile = document.getElementsByClassName('wptb-preview-table-mobile');
			if (wptbTableContainer.length > 0 && wptbPreviewTable.length > 0) {
				var sw = wptbTableContainer[0].offsetWidth;
				if (sw < 480) {
					wptbPreviewTable[0].style.display = 'none';

					if (wptbPreviewTableMobile.length == 0) {
						var tableRows = wptbPreviewTable[0].rows;
						var tableRowTop = tableRows[0];
						var tableRowTopChildren = tableRowTop.children;
						var columnCount = 0;

						for (var i = 0; i < tableRowTopChildren.length; i++) {
							columnCount += tableRowTopChildren[i].colSpan;
						}

						var newTableArray = [];

						for (var _i = 0; _i < columnCount; _i++) {
							newTableArray[_i] = [];
						}

						for (var _i2 = 0; _i2 < tableRows.length; _i2++) {
							var rowChildren = tableRows[_i2].children;

							for (var j = 0; j < columnCount; j++) {
								if (rowChildren[j].dataset.xIndex == j) {
									var tdNew = rowChildren[j].cloneNode(true);
									if (tableRows[_i2].style.backgroundColor) {
										tdNew.style.backgroundColor = tableRows[_i2].style.backgroundColor;
									}
									newTableArray[j].push(tdNew);
								} else {
									newTableArray[j].push('');
								}
							}
						}

						var table = document.createElement('table');
						table.classList.add('wptb-preview-table-mobile');
						var tableStyle = wptbPreviewTable[0].getAttribute('style');
						table.setAttribute('style', tableStyle);
						table.style.display = 'table';
						for (var _i3 = 0; _i3 < columnCount; _i3++) {
							var row = table.insertRow(-1);
							row.classList.add('wptb-row');

							for (var _j = 0; _j < tableRows.length; _j++) {
								if (newTableArray[_i3][_j]) {
									row.appendChild(newTableArray[_i3][_j]);
								}
							}
						}

						wptbTableContainer[0].appendChild(table);
					} else {
						wptbPreviewTableMobile[0].style.display = 'table';
					}
				} else {
					wptbPreviewTable[0].style.display = 'table';
					if (wptbPreviewTableMobile.length > 0) {
						wptbPreviewTableMobile[0].style.display = 'none';
					}
				}
			}
		}

		wptb_tdDefaultWidth();
		wptb_tableReconstraction();

		// when window resize call wpcd_archiveSectionSmall and wptb_tableGenerateMobile
		$(window).resize(function () {
			wptb_tdDefaultWidth();
			wptb_tableReconstraction();
		});

		function wptb_tableReconstraction() {
			for (var i = 0; i < tableContainers.length; i++) {
				var tableContainer = tableContainers[i];

				// Set default indicator of creating a new table in true
				var createNewTableIndic = true;

				var previewTable = tableContainer.getElementsByClassName('wptb-preview-table');
				var tableContainerMatrix = tableContainer.getElementsByClassName('wptb-table-container-matrix');

				if (previewTable.length > 0 && tableContainerMatrix.length > 0) {
					previewTable = previewTable[0];
					tableContainerMatrix = tableContainerMatrix[0];
					previewTable.style.display = 'table';

					if (previewTable.dataset.wptbTableAlignment) {
						var wptbTableAlignment = previewTable.dataset.wptbTableAlignment;


						var wptbTableContainerWidth = tableContainer.offsetWidth;
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
						var tableContainerWidth = tableContainer.offsetWidth;
						var previewTableWidth = previewTable.offsetWidth;

						// get count of table columns
						var tableColumns = void 0;
						var previewTableRows = previewTable.rows;
						if (previewTableRows.length > 0) {
							var firstRow = previewTableRows[0];
							var tdsRow = firstRow.querySelectorAll('td');

							tableColumns = tdsRow.length;
						}

						// check the top line if it is presented as a title
						var tablePreviewHeadIndic = previewTable.classList.contains('wptb-table-preview-head');

						// check conditions: if table top row is as "header" - table must have more that two columns,
						// otherwise table must have more taht one columns
						var tableReconstructed = false;
						var wptbPreviewTableMobile = void 0;
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
									var tdWidth = previewTableWidth / tableColumns;

									// get the quantity of whole Columns that are can placed in the container
									var wholeColumnsInContainer = Math.floor(tableContainerWidth / tdWidth);
									if (wholeColumnsInContainer < 1) wholeColumnsInContainer = 1;

									// check for the existence of a mobile table
									// if it available, check this table for compliance
									// with our conditions. If it compliance, remain this table
									// and cancel creating a new table ( createNewTableIndic = false ).
									if (tableContainer.getElementsByClassName('wptb-preview-table-mobile').length > 0) {
										wptbPreviewTableMobile = tableContainer.getElementsByClassName('wptb-preview-table-mobile')[0];
										wptbPreviewTableMobile.classList.remove('wptb-mobile-hide');
										var dataWholeColumnInContainer = wptbPreviewTableMobile.dataset.wholeColumnsInContainer;

										if (dataWholeColumnInContainer == wholeColumnsInContainer && previewTable.classList.contains('wptb-table-preview-head')) {
											createNewTableIndic = false;
										} else if (dataWholeColumnInContainer == wholeColumnsInContainer && !previewTable.classList.contains('wptb-table-preview-head') && (tableContainerWidth > 480 || wptbPreviewTableMobile.column == 1)) {
											createNewTableIndic = false;
										} else {
											wptbPreviewTableMobile.parentNode.removeChild(wptbPreviewTableMobile);
										}
									}
									//
									// if indicator of creating of table "true" - continue
									if (createNewTableIndic) {
										// create new table for mobile devices
										var newTable = document.createElement('table');
										var newTableTbody = document.createElement('tbody');
										newTable.appendChild(newTableTbody);

										// add css class for new mobile table
										newTable.classList.add('wptb-preview-table-mobile');
										var infArr = previewTable.className.match(/wptb-element-main(.+)-(\d+)/i);
										if (infArr && Array.isArray(infArr)) {
											newTable.classList.add(infArr[0]);
										}

										// get number of rows for wptb-preview-table
										var tableRows = previewTable.rows.length;

										// In this variable must have quantity columns of the last section of the new table
										var newTableLastSectionFilledColumns = void 0;

										// set valuesIsSaved in 'false'
										// if the parameters newTableLastSectionFilledColumns get
										// optimal values, valuesIsSaved must have value 'true'
										var valuesIsSaved = false;

										// check if top row is as "header"
										if (previewTable.classList.contains('wptb-table-preview-head')) {
											// quantity rows without top row
											var tableRowsWithoutHeader = tableRows - 1;

											// this variable will have quantity columns in new mobile table
											var newTableColumnsWithoutLeftHeader = void 0;

											// if quantity of rows in desktop table more than
											// quantity whole columns which are can placed in the container,
											// execute "loop for"
											if (tableRows > wholeColumnsInContainer) {
												// this code, сyclical reduces the number of columns in the new table,
												// until the optimal view is obtained so that the last block of the new table
												// has more than half the columns compared to the previous blocks
												for (var _i4 = 0; _i4 < tableRowsWithoutHeader; _i4++) {
													newTableColumnsWithoutLeftHeader = wholeColumnsInContainer - 1 - _i4;
													if (newTableColumnsWithoutLeftHeader <= 0) newTableColumnsWithoutLeftHeader = 1;

													newTableLastSectionFilledColumns = tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;

													if (newTableLastSectionFilledColumns == 0) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumnsWithoutLeftHeader > 0 && newTableColumnsWithoutLeftHeader <= 6 && newTableColumnsWithoutLeftHeader - 2 * newTableLastSectionFilledColumns < 0 && newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumnsWithoutLeftHeader > 6 && newTableColumnsWithoutLeftHeader <= 12 && newTableColumnsWithoutLeftHeader - 1.8 * newTableLastSectionFilledColumns < 0 && newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumnsWithoutLeftHeader > 12 && newTableColumnsWithoutLeftHeader <= 18 && newTableColumnsWithoutLeftHeader - 1.6 * newTableLastSectionFilledColumns < 0 && newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader) {
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
												var countRows = void 0;
												if (newTableColumnsWithoutLeftHeader > 0) {
													countRows = tableColumns * Math.ceil(tableRowsWithoutHeader / newTableColumnsWithoutLeftHeader);
												} else {
													countRows = tableColumns;
												}

												var sectionNumberLast = Math.floor((countRows - 1) / tableColumns);
												var tdStyles = void 0;
												for (var j = 0; j < countRows; j++) {
													var sectionNumber = Math.floor(j / tableColumns);
													var tr = document.createElement('tr');
													var tdLeftHeader = previewTable.rows[0].children[j - sectionNumber * tableColumns].cloneNode(true);
													var td = void 0;
													var rowFirstStyles = window.getComputedStyle(previewTable.rows[0]);
													if (!tdLeftHeader.style.backgroundColor) {
														tdLeftHeader.style.backgroundColor = rowFirstStyles.backgroundColor;
													}
													tdLeftHeader.style.width = null;
													tdLeftHeader.style.height = null;
													//tdLeftHeader.removeAttribute('data-x-index');
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

													for (var k = newTableColumnsWithoutLeftHeader * sectionNumber + 1; k < newTableColumnsWithoutLeftHeader * (sectionNumber + 1) + 1; k++) {
														if (k < previewTable.rows.length) {
															td = previewTable.rows[k].children[j - sectionNumber * tableColumns].cloneNode(true);
															var rowKStyles = window.getComputedStyle(previewTable.rows[k]);
															if (!td.style.backgroundColor) {
																td.style.backgroundColor = rowKStyles.backgroundColor;
															}

															td.style.width = null;
															td.style.height = null;
															//td.removeAttribute('data-x-index');
															td.removeAttribute('data-wptb-css-td-auto-width');
														} else {
															td = document.createElement('td');
															td.style.borderWidth = '0px';

															td.style.background = '#fff';
														}

														tdStyles = window.getComputedStyle(previewTable.querySelector('td'));
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
											var newTableColumns = void 0;
											if (tableContainerWidth > 480) {
												for (var _i5 = 0; _i5 < tableColumns; _i5++) {
													newTableColumns = wholeColumnsInContainer - _i5;
													if (newTableColumns == 0) newTableColumns = 1;
													newTableLastSectionFilledColumns = tableColumns % newTableColumns;

													if (newTableLastSectionFilledColumns == 0) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumns > 0 && newTableColumns <= 6 && newTableColumns - 2 * newTableLastSectionFilledColumns <= 0 && newTableLastSectionFilledColumns < newTableColumns) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumns > 6 && newTableColumns <= 12 && newTableColumns - 1.8 * newTableLastSectionFilledColumns <= 0 && newTableLastSectionFilledColumns < newTableColumns) {
														valuesIsSaved = true;
														break;
													} else if (newTableColumns > 12 && newTableColumns <= 18 && newTableColumns - 1.6 * newTableLastSectionFilledColumns <= 0 && newTableLastSectionFilledColumns < newTableColumns) {
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

											var increaseRatioRows = Math.ceil(tableColumns / newTableColumns);

											var newTableRows = increaseRatioRows * tableRows;

											if (valuesIsSaved) {
												for (var _i6 = 0; _i6 < newTableRows; _i6++) {
													var _sectionNumber = Math.floor(_i6 / tableRows);
													var _tr = document.createElement('tr');
													var jMax = void 0;
													var jStart = void 0;
													if (_sectionNumber != increaseRatioRows - 1 || newTableLastSectionFilledColumns == 0) {
														jStart = _sectionNumber * newTableColumns;
														jMax = newTableColumns * (1 + _sectionNumber);
													} else {
														jStart = tableColumns - newTableLastSectionFilledColumns;
														jMax = tableColumns;
													}
													var row = previewTable.rows[_i6 - _sectionNumber * tableRows];
													_tr.classList = row.classList;
													_tr.style.backgroundColor = row.style.backgroundColor;

													for (var _j2 = jStart; _j2 < jMax; _j2++) {
														var newTd = row.children[_j2].cloneNode(true);
														if (!newTd.style.backgroundColor) {
															var rowStyles = window.getComputedStyle(row);
															newTd.style.backgroundColor = rowStyles.backgroundColor;
														}
														newTd.style.width = null;
														newTd.style.height = null;
														//newTd.removeAttribute('data-x-index');
														newTd.removeAttribute('data-wptb-css-td-auto-width');
														_tr.appendChild(newTd);
													}

													newTableTbody.appendChild(_tr);
												}
											}
										}

										newTable.dataset.wholeColumnsInContainer = wholeColumnsInContainer;
										var images = newTable.querySelectorAll('[srcset]');
										if (images.length > 0) {
											for (var _i7 = 0; _i7 < images.length; _i7++) {
												images[_i7].removeAttribute('srcset');
											}
										}
										wptbPreviewTableMobile = newTable;
										tableContainer.appendChild(newTable);
										tableReconstructed = true;
									}
								}
							} else {
								if (tableContainerMatrix && tableContainerMatrix.classList.contains('wptb-matrix-hide')) {
									tableContainerMatrix.classList.remove('wptb-matrix-hide');
									tableReconstructed = true;
									previewTable.classList.remove('wptb-mobile-view-active');
									wptbPreviewTableMobile = tableContainer.querySelector('.wptb-preview-table-mobile');
									if (wptbPreviewTableMobile) {
										tableContainer.getElementsByClassName('wptb-preview-table-mobile')[0].classList.add('wptb-mobile-hide');
									}
									tableContainer.style.overflow = 'auto';
								}
							}
						} else {
							previewTable.style.minWidth = 'auto';
						}

						WPTB_RecalculateIndexes(previewTable);

						if (tableReconstructed) {
							WPTB_RecalculateIndexes(wptbPreviewTableMobile);
							var tabEvent = new CustomEvent('table:rebuilt', { detail: true, bubbles: true });
							previewTable.dispatchEvent(tabEvent);
						}
					}
				}
			}
		}

		function wptb_tdDefaultWidth() {
			var wptbTableContainers = document.getElementsByClassName('wptb-table-container');
			// let frontendEditLink = document.querySelectorAll( '.wptb-frontend-table-edit-link' );
			for (var i = 0; i < wptbTableContainers.length; i++) {
				var wptbTableContainer = wptbTableContainers[i];

				wptbTableContainer.classList.add('wptb-table-container-' + i);

				var table = wptbTableContainer.getElementsByClassName('wptb-preview-table');
				if (table.length > 0) {
					table = table[0];

					if (table.dataset.wptbTableContainerMaxWidth) {
						wptbTableContainer.style.maxWidth = table.dataset.wptbTableContainerMaxWidth + 'px';
					}
					table.classList.remove('wptb-table-preview-static-indic');

					table.mergingСellsHorizontally = false;
					var tds = table.querySelectorAll('td');
					for (var j = 0; j < tds.length; j++) {
						if (tds[j].colSpan > 1) {
							table.mergingСellsHorizontally = true;
						}
					}
					var wptbTableContainerWidth = wptbTableContainer.offsetWidth;

					var td = table.querySelector('td');
					var tdStyleObj = window.getComputedStyle(td, null);
					var tdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
					var tdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');
					var tdPaddingLeftWidth = tdStyleObj.getPropertyValue('padding-left');
					var tdPaddingRightWidth = tdStyleObj.getPropertyValue('padding-left');
					var tdPaddingCommon = parseFloat(tdPaddingLeftWidth, 10) + parseFloat(tdPaddingRightWidth, 10);
					var tableTdBorderCommonWidth = parseFloat(tdBorderLeftWidth, 10) + parseFloat(tdBorderRightWidth, 10);
					var wptbTableTdsSumMaxWidth = table.dataset.wptbTableTdsSumMaxWidth;
					var wptbFixedWidthSize = table.dataset.wptbFixedWidthSize;
					var wptbCellsWidthAutoCount = table.dataset.wptbCellsWidthAutoCount;

					var styleElementCreate = false;
					var tableTdWidthAuto = void 0;
					if (wptbTableTdsSumMaxWidth < wptbTableContainerWidth) {
						if (wptbCellsWidthAutoCount) {
							table.style.minWidth = '100%';

							//                        if( frontendEditLink && frontendEditLink[i] ) {
							//                            frontendEditLink[i].style.minWidth = wptbTableTdsSumMaxWidth + 'px';
							//                        }

							if (table.mergingСellsHorizontally) {
								table.style.width = 'auto';
								var tableTdsWidthAutoCommon = wptbTableContainerWidth - wptbFixedWidthSize;
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
							table.style.maxWidth = wptbTableTdsSumMaxWidth + 'px';

							//                        if( frontendEditLink && frontendEditLink[i] ) {
							//                            frontendEditLink[i].style.width = null;
							//                            frontendEditLink[i].style.minWidth = null;
							//                            frontendEditLink[i].style.maxWidth = wptbTableTdsSumMaxWidth + 'px';
							//                        }
						}
					} else {
						table.style.maxWidth = null;
						table.style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
						table.style.width = 'auto';
						tableTdWidthAuto = table.dataset.wptbTdWidthAuto ? table.dataset.wptbTdWidthAuto : '100';
						styleElementCreate = true;

						//                    if( frontendEditLink && frontendEditLink[i] ) {
						//                        frontendEditLink[i].style.maxWidth = '100%';
						//                        frontendEditLink[i].style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
						//                        frontendEditLink[i].style.width = null;
						//                    }
					}

					var _document = document,
					    head = _document.head;

					if (head) {
						var cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width-' + i + '="true"]');

						if (cssForTdsWidthAutoOld) {
							head.removeChild(cssForTdsWidthAutoOld);
						}
					}

					if (styleElementCreate) {
						var cssForTdsWidthAuto = document.createElement('style');
						cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width-' + i, true);
						cssForTdsWidthAuto.innerHTML = '.wptb-table-container-' + i + ' table td[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
						if (head) {
							head.appendChild(cssForTdsWidthAuto);
						}
					}
				}
			}
		}

		// code for adding of old css styles for correct view
		var elements = document.getElementsByClassName('wptb-ph-element');
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.classList.contains('wptb-list-item-container')) {
				element.classList.remove('wptb-list-item-container');
				element.classList.add('wptb-list-container');
			}

			if (element.classList.contains('wptb-button-container')) {
				var infArr = element.className.match(/wptb-size-([A-Z]+)/i);
				if (infArr && Array.isArray(infArr)) {
					var wptbSize = infArr[0];
					var wptbSizeNew = wptbSize.toLowerCase();

					element.classList.remove(wptbSize);

					var wptbButtonWrapper = element.querySelector('.wptb-button-wrapper');
					if (wptbButtonWrapper) {
						wptbButtonWrapper.classList.add(wptbSizeNew);
					}
				}
			}
		}

		// responsive setup
		// eslint-disable-next-line no-unused-vars
		var responsiveFront = new WPTB_ResponsiveFrontend({
			query: '.wptb-preview-table',
			bindToResize: true
		});

		responsiveFront.rebuildTables();

		//sorting table
		function sortingTable() {
			var tables = document.querySelectorAll('.wptb-preview-table');
			for (var _i8 = 0; _i8 < tables.length; _i8++) {
				var sortableTable = new WPTB_SortableTable(tables[_i8]);
				sortableTable.sortableTableInitialization(responsiveFront);
			}
		}
		sortingTable();
	});
})(jQuery);
//# sourceMappingURL=wp-table-builder-frontend.js.map
