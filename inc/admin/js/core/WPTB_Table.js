var array = [], WPTB_Table = function (columns, rows) {

	/* The members of the class */
	var settings = document.getElementsByClassName('wptb-settings-items'),
		wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
		table, row, cell,
		maxAmountOfCells,
		maxAmountOfRows;

	//HERE ARE THE PRIVATE FUNCTIONS
	/*
	 * This function toggles buttons visibility in cell edit mode
	 * (according to the amount of currently selected cells), and
	 * highlights visually the clicked cell if it is not highlighted, or
	 * removes highlight if clicked cell is already highlighted. 
	 * It too toggles the bits of our abstract representation.
	 * @param Event this is the event instance of the click performed over a cell.
	 */
	var mark = function (event) {
		var rs = this.rowSpan,
			cs = this.colSpan,
			markedCells,
			noCells = document.getElementsByClassName('no-cell-action'),
			singleCells = document.getElementsByClassName('single-action'),
			multipleCells = document.getElementsByClassName('multiple-select-action'),
			position = getCoords(this),
			row = position[0],
			column = position[1];
		if (!document.select.isActivated()) {
			return;
		}
		if (this.className.match(/wptb-highlighted/)) {
			this.classList.remove('wptb-highlighted');
			for (var i = 0; i < rs; i++) {
				for (var j = 0; j < cs; j++) {
					array[row + i][column + j] = 0;
				}
			}
		} else {
			this.classList.add('wptb-highlighted');
			for (var i = 0; i < rs; i++) {
				for (var j = 0; j < cs; j++) {
					array[row + i][column + j] = 1;
				}
			}
		}

		markedCells = document.getElementsByClassName('wptb-highlighted').length;
		if (markedCells === 0) {
			for (var i = 0; i < multipleCells.length; i++) {
				multipleCells[i].classList.remove('visible');
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.add('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.remove('visible');
			}
		} else if (markedCells === 1) {
			for (var i = 0; i < multipleCells.length; i++) {
				multipleCells[i].classList.remove('visible');
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.remove('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.add('visible');
			}
		} else {
			for (var i = 0; i < multipleCells.length; i++) {
				if (table.isSquare(array)) {
					multipleCells[i].classList.add('visible');
				} else {
					multipleCells[i].classList.remove('visible');
				}
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.remove('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.remove('visible');
			}
		}
	};

	/* 
	 * This function fills an array with 1's according to the actual design
	 * of HTML table.
	 * @returns an array of arrays containing an abstract representation
	 * of HTML table.
	 * @deprecated
	 * */

	var realTimeArray = function () {
		var carried = [], tds, cols, matriz = [];

		for (var i = 0; i < maxAmountOfCells; i++) {
			carried[i] = 0;
		}

		for (var i = 0; i < table.rows.length; i++) {
			cols = [];

			var tds = table.rows[i].getElementsByTagName('td');

			for (items = 0; items < tds.length; items++) {

				for (var k = 0; k < tds[items].colSpan; k++) {
					cols.push(1);
				}

				if (tds[items].rowSpan > 1) {
					for (var k = 0; k < tds[items].colSpan; k++) {
						carried[items + k] = {
							justAssigned: true,
							amount: tds[items].rowSpan
						};
					}
				}
			}

			for (var k = 0; k < maxAmountOfCells; k++) {
				if (typeof carried[k] == 'object' && carried[k].amount > 0) {
					carried[k].amount--;
					if (carried[k].justAssigned) {
						carried[k].justAssigned = false;
					} else {
						cols.push(1);
					}
				}
			}

			matriz.push(cols);

		}
		return matriz;
	};

	/*
	 * This function gets the number and position of cell spaces in current row that are occuped 
	 * by upper rowspanned cells.
	 * @param number the number of row where we wish to calculate the carried rowspans up to.
	 * @return an array with the remaining rowspans in each column.
	 */
	var carriedRowspans = function (row) {
		var carried = [], tds, cols;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carried[i] = 0;
		}

		if (row == -1) {
			return carried;
		}

		for (var i = 0; i <= row; i++) {
			cellsBuffer = table.rows[i].getElementsByTagName('td');
			cellPointer = 0;

			for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
				stepsToMove = 1;

				if (carried[xPosition]) {
					carried[xPosition]--;
				} else {
					celda = cellsBuffer[cellPointer++];
					if (celda.rowSpan > 1) {
						for (k = 0; k < celda.colSpan; k++) {
							carried[xPosition + k] = celda.rowSpan - 1;
						}
						stepsToMove = celda.colSpan;
					} else if (celda.colSpan > 1) {
						stepsToMove = celda.colSpan;
					}
				}
			}

		}
		return carried;
	};

	/*
	 * A helpful function for showing
	 * the abstract table in console.
	 * @param Array our abstract table.
	 */
	var drawTable = function (a) {
		var string = 'DRAWING TABLE:\n';
		for (var i = 0; i < a.length; i++) {

			for (var j = 0; j < a[i].length; j++) {
				string += ' ' + a[i][j];
			}
			string += '\n';
		}
		table.isSquare(a);
	};

	/*
	 * It resets all the bits of our abstract representation
	 * to 0 and removes the highlighting class of all cells.
	 */

	var undoSelect = function () {
		var noCells = document.getElementsByClassName('no-cell-action'),
			singleCells = document.getElementsByClassName('single-action'),
			multipleCells = document.getElementsByClassName('multiple-select-action'),
			tds = table.getElementsByClassName('wptb-highlighted');
		while (tds.length) {
			tds[0].classList.remove('wptb-highlighted');
		}
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				array[i][j] = 0;
			}
		}
		for (var i = 0; i < multipleCells.length; i++) {
			multipleCells[i].classList.remove('visible');
		}
		for (var i = 0; i < noCells.length; i++) {
			noCells[i].classList.add('visible');
		}
		for (var i = 0; i < singleCells.length; i++) {
			singleCells[i].classList.remove('visible');
		}
	};

	/*
	 * This fills the abstract representation of our table with 
	 * zeros, at the start. the max amount of cells is the greatest sum
	 * of all colspans for row.
	 */

	var fillTableArray = function () {
		var colspansSums = [], a = [];

		//calculate max amount of cells inside a row
		for (var i = 0; i < table.rows.length; i++) {
			var cells = table.rows[i].getElementsByTagName('td'),
				colspanSumInRow = 0;
			for (var j = 0; j < cells.length; j++) {
				colspanSumInRow += cells[j].colSpan;
			}
			colspansSums.push(colspanSumInRow);
		}

		maxAmountOfCells = Math.max.apply(null, colspansSums);
		//calculate max rows
		var maxAmountOfRows = table.rows.length;

		// fill with zeros from both values
		for (var i = 0; i < maxAmountOfRows; i++) {
			a[i] = [];
			for (var j = 0; j < maxAmountOfCells; j++) {
				a[i].push(0);
			}
		}
		drawTable(a);
		return a;
	};

	/*
	 * This function gets the sum of all colspans in a row.
	 * @param number the number of row to be used as reference.
	 */
	var getActualPointsInRow = function (row) {
		var tds = table.rows[row].getElementsByTagName('td'),
			points = 0;
		for (var i = 0; i < tds.length; i++) {
			points += tds[i].colSpan;
		}
		return points;
	}

	/*
	 * This function gets us the exact coordinates of
	 * an exact cell, in a more reliable way than xIndex and yIndex,
	 * these last ones were meant to be used for getting the cell trough them.
	 * @param DOMElement the cell to get the coordinates.
	 */
	var getCoords = function (search) {
		var skipInCols = [], cell;

		for (var i = 0; i < maxAmountOfCells; i++) {
			skipInCols[i] = 0;
		}

		for (var i = 0; i < table.rows.length; i++) {
			var cellsBuffer = table.rows[i].getElementsByTagName('td');
			cellPointer = 0;
			for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
				stepsToMove = 1;

				if (skipInCols[xPosition]) {
					skipInCols[xPosition]--;
				} else {
					var td = cellsBuffer[cellPointer++];
					if (td == search) {
						return [i, xPosition];
					}
					if (td.rowSpan > 1) {
						for (k = 0; k < td.colSpan; k++) {
							skipInCols[xPosition + k] = td.rowSpan - 1;
						}
						stepsToMove = td.colSpan;
					} else if (td.colSpan > 1) {
						stepsToMove = td.colSpan;
					}
				}
			}
		}
	};

	//END OF PRIVATE FUNCTIONS
	for (var i = 0; i < settings.length; i++) {
		if (settings[i].id !== 'wptb-apply-inner-border') {
			settings[i].classList.add('visible');
		}
	}

	//Create a HTML Table element.
	table = document.createElement('table');
	table.classList.add('wptb-preview-table');

	jQuery('#wptb-table-header-bg').val('');
	jQuery('#wptb-even-row-bg').val('');
	jQuery('#wptb-odd-row-bg').val('');
	jQuery('#wptb-table-border-color').val('');
	jQuery('#wptb-table-inner-border-number,#wptb-table-inner-border-slider').val('0');
	jQuery('#wptb-table-border-number,#wptb-table-border-slider').val('0');
	jQuery('#wptb-table-padding-number,#wptb-table-padding-slider').val('15');

	//Add the header row.
	row = table.insertRow(-1);
	row.classList.add('wptb-table-head', 'wptb-row');

	for (var i = 0; i < columns; i++) {
		cell = new WPTB_Cell(mark);
		cell.setCoords(0, i);
		row.appendChild(cell.getDOMElement());
	}

	//Add the data rows.
	for (var i = 1; i < rows; i++) {

		row = table.insertRow(-1);
		row.classList.add('wptb-row');

		for (var j = 0; j < columns; j++) {
			cell = new WPTB_Cell(mark);
			cell.setCoords(i, j);
			row.appendChild(cell.getDOMElement());
		}
	}

	/*
	 * This just toggles visibility of cell edit bar, and toggles 
	 * cell selecting mode.
	 */

	table.toggleTableEditMode = function () {
		var bar = document.getElementById('edit-bar');
		if (bar.classList.contains('visible')) {
			document.select.deactivateMultipleSelectMode();
			bar.classList.remove('visible');
		} else {
			document.select.activateMultipleSelectMode();
			bar.classList.add('visible');
		}
	}

	/*
	 * For assigning to each cell xIndex and y Index attributes,
	 * these are the column number and row number of cell in table. 
	 */

	table.recalculateIndexes = function () {
		var trs = this.getElementsByTagName('tr'), tds, maxCols = 0;

		for (var i = 0; i < trs.length; i++) {
			tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {

				if (i == 0) {
					tds[j].parentNode.className = '';
					tds[j].style.backgroundColor = jQuery('#wptb-table-header-bg').val();
					tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
				} else {
					if (i % 2 == 0) {
						tds[j].style.backgroundColor = jQuery('#wptb-odd-row-bg').val();
					} else {
						tds[j].style.backgroundColor = jQuery('#wptb-even-row-bg').val();
					}
					tds[j].parentNode.className = '';
					tds[j].parentNode.classList.add('wptb-row');
				}

				tds[j].dataset.xIndex = j;
				tds[j].dataset.yIndex = i;
			}
			if (j > maxCols) {
				maxCols = j;
			}
		}
		this.columns = maxCols;
	}

	/*
	 * As simple as it is: adds a column to the end of table.
	 */
	table.addColumnEnd = function () {
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			table.rows[i].appendChild(td.getDOMElement());
			array[i].push(0);
		}
		maxAmountOfCells++;
		recalculateIndexes();
		undoSelect();
	};

	/*
	 * As simple as it looks: adds a column to the start of table.
	 */

	table.addColumnStart = function () {
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			firstCell = table.rows[i].getElementsByTagName('td')[0];
			if (firstCell) {
				table.rows[i].insertBefore(td.getDOMElement(), firstCell);
			} else {
				table.rows[i].appendChild(td.getDOMElement());
			}
			array[i].push(0);
		}

		maxAmountOfCells++;
		recalculateIndexes();
		undoSelect();
	};

	/*
	 * Well, not so simple as previous functions.
	 * It adds a column after a certain column of reference.
	 * @param integer the column number to be used as reference.
	 *	If empty, then the first highlighted cell is used as reference.
	 */

	table.addColumnAfter = function (c_pos) {
		var rows = table.rows,
			cellsBuffer,
			cell = document.querySelector('.wptb-highlighted'),
			pos = c_pos != undefined && typeof c_pos === 'number' ? c_pos : getCoords(cell)[1],
			pendingInsertion = false,
			stepsToMove,
			td, bro,
			carriedRowspans = [],
			currentCell;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carriedRowspans.push(0);
		}

		for (var i = 0; i < rows.length; i++) {
			cellPointer = 0;
			cellsBuffer = rows[i].getElementsByTagName('td');
			pendingInsertion = false;
			for (var xPosition = 0;
				xPosition < maxAmountOfCells;
				xPosition += stepsToMove) {
				stepsToMove = 1;

				if (pendingInsertion) {
					td = new WPTB_Cell(mark);

					if (currentCell && rows[i].contains(currentCell)) {
						bro = currentCell.nextSibling;
						if (bro) {
							rows[i].insertBefore(td.getDOMElement(), bro);
						} else {
							rows[i].appendChild(td.getDOMElement());
						}
					} else {
						rows[i].insertBefore(td.getDOMElement(), cellsBuffer[0]);
					}
					break;
				} else if (carriedRowspans[xPosition] > 0) {
					// If no pending insertion, let's check if no rowspan from upper cells is pending in current position
					if (pos == xPosition) {
						pendingInsertion = true;
					}
				} else {
					currentCell = cellsBuffer[cellPointer++];
					if (currentCell.rowSpan > 1) {
						stepsToMove = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							carriedRowspans[xPosition + k] = currentCell.rowSpan;
							if (xPosition + k == pos) {
								pendingInsertion = true;
							}
						}
					} else if (currentCell.colSpan > 1) {
						stepsToMove = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							if (xPosition + k == pos) {
								pendingInsertion = true;
							}
						}
					} else if (xPosition == pos) {
						pendingInsertion = true;
					}
				}
			}

			for (var l = 0; l < maxAmountOfCells; l++) {
				if (carriedRowspans[l] > 0)
					carriedRowspans[l]--;
			}

		}

		for (var i = 0; i < array.length; i++) {
			array[i].push(0);
		}
		maxAmountOfCells++;
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();

	};

	/*
	 * For preventing us to take a lot of time,
	 * This is just calling the function addColumnAfter, but
	 * using the previous column to current one as reference.
	 * @see addColumnAfter
	 */

	table.addColumnBefore = function () {
		var cell = document.querySelector('.wptb-highlighted'),
			pos = getCoords(cell)[1];

		if (pos === 0) {
			table.addColumnStart();
		}
		else {
			table.addColumnAfter(pos - 1);
		}
	};

	/*
	 * Luckily, thisfunction is simple, 
	 * it just add a row to the end of table.
	 */

	table.addRowToTheEnd = function () {
		var r = table.insertRow(-1),
			td,
			aux;
		for (var i = 0; i < maxAmountOfCells; i++) {
			td = new WPTB_Cell(mark);
			r.appendChild(td.getDOMElement());
		}
		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
	 * Yet another simple function, 
	 * it just add a row to the start of table.
	 */

	table.addRowToTheStart = function () {
		var r = table.insertRow(0);
		for (var i = 0; i < maxAmountOfCells; i++) {
			td = new WPTB_Cell(mark);
			r.appendChild(td.getDOMElement());
		}
		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/* 
	 * This function adds a row before the current one.
	 * Since the biggest factor of problem is a not-started but ongoing rowspan,
	 * the most of the troubles is not here.
	 */

	table.addRowBefore = function () {
		var cell = document.querySelector('.wptb-highlighted'),
			row = getCoords(cell)[0],
			r = table.insertRow(row),
			aux,
			rowspans = carriedRowspans(row - 1);

		noPending = rowspans.filter(function (elem) {
			return elem == 0;
		});

		for (var i = 0; i < noPending.length; i++) {
			var td = new WPTB_Cell(mark);
			r.appendChild(td.getDOMElement());
		}

		arr = realTimeArray();

		for (var i = 0; i < arr.length; i++) {

			if (arr[i].length > maxAmountOfCells) {
				//Still not watched
			}

			if (arr[i].length < maxAmountOfCells) {

				for (var j = arr[i].length; j < maxAmountOfCells; j++) {
					td = new WPTB_Cell(mark);
					table.rows[i].appendChild(td.getDOMElement());
				}
			}
		}

		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
	 * Well... by the name convention of the previous 3 functions,
	 * it's pretty obvious that this functions attaches a new
	 * row after highlighted cell row. The greatest obstacle it was
	 * the possibility of a TR not having the exact amount of columns
	 * occuped by actual node but rowspanned upper cells. For that purpose
	 * it was created the function realTimeArray.
	 * @see realTimeArray
	 */

	table.addRowAfter = function () {

		var cell = document.querySelector('.wptb-highlighted'),
			row = getCoords(cell)[0],
			r = table.insertRow(row + 1),
			aux,
			rowspans = carriedRowspans(row);

		noPending = rowspans.filter(function (elem) {
			return elem == 0;
		});

		for (var i = 0; i < noPending.length; i++) {
			td = new WPTB_Cell(mark);
			r.appendChild(td.getDOMElement());
		}

		arr = realTimeArray();

		for (var i = 0; i < arr.length; i++) {

			if (arr[i].length > maxAmountOfCells) {
				//Still not watched
			}

			if (arr[i].length < maxAmountOfCells) {

				for (var j = arr[i].length; j < maxAmountOfCells; j++) {
					td = new WPTB_Cell(mark);
					table.rows[i].appendChild(td.getDOMElement());
				}
			}
		}

		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
	 * This function checks the current selected cells
	 * make a rectangular shape.
	 * @param Array the abstract table.
	 * @return false, if not making a rectangle, or
	 *	Array an array containing number of rows and columns, if selection makes a rectangle.
	 */

	table.isSquare = function (a) {
		var rowStart = -1,
			columnStart = -1,
			rowEnd = -1,
			columnEnd = -1,
			height,
			width,
			itemsEstimate = 0,
			items = 0;

		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < a[i].length; j++) {
				if (a[i][j] == 1) {
					rowStart = i;
					columnStart = j;
					break;
				}
			}
			if (rowStart !== -1 && columnStart !== -1) {
				break;
			}
		}

		for (var i = a.length - 1; i > -1; i--) {
			for (var j = a[i].length - 1; j > -1; j--) {
				if (a[i][j] == 1) {
					rowEnd = i;
					columnEnd = j;
					break;
				}
			}
			if (rowEnd !== -1 && columnEnd !== -1) {
				break;
			}
		}


		for (var i = rowStart; i < rowEnd; i++) {
			for (var j = columnStart; j < columnEnd; j++) {
				if (a[i][j] == 0 || a[i][j] == undefined) {
					return false;
				}
			}
		}

		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < a[i].length; j++) {
				if (a[i][j] == 1) {
					items++;
				}
			}
		}

		height = rowEnd - rowStart + 1;
		width = columnEnd - columnStart + 1;
		itemsEstimate = height * width;

		if (itemsEstimate !== items) {
			return false;
		}
		return [height, width];
	};

	/*
	 * This function merges all selected cells.
	 * Well, actually sets the colspan and rowspan of first 
	 * upper left  cell in selection and deletes the another selected cells.
	 */

	table.mergeCells = function () {
		var dimensions = table.isSquare(array),
			rowspan = dimensions[0],
			colspan = dimensions[1],
			first = document.querySelector('.wptb-highlighted'),
			tds = [].slice.call(document.getElementsByClassName('wptb-highlighted'), 1);

		for (var i = 0; i < tds.length; i++) {
			var p = tds[i].parentNode;
			p.removeChild(tds[i]);
		}

		first.colSpan = colspan;
		first.rowSpan = rowspan;
		undoSelect();
	};

	/*
	 * This functions makes the exact inverse as above.
	 * It resets colspan and rowspan and appends 
	 * the same amount in cells to the table.
	 * @bug
	 */

	table.splitCell = function () {
		var cell = document.getElementsByClassName('wptb-highlighted')[0],
			rowspan = cell.rowSpan,
			colspan = cell.colSpan;
		cell.rowSpan = 1;
		cell.colSpan = 1;
		table.addLackingCells();

		undoSelect();
	};

	/*
	 * Searches for rowspanned cells up to row number meeting it.
	 * @param number the number of row where the function
	 * must search up to.
	 */

	table.findRowspannedCells = function (row) {
		var array = [],
			difference;
		actualPoints = getActualPointsInRow(row);
		if (actualPoints === maxAmountOfCells) {
			return [];
		}
		difference = maxAmountOfCells - actualPoints;

		for (var i = row - 1; i >= 0 && difference; i--) {
			var tds = table.rows[i].getElementsByTagName('td');
			for (var i = 0; i < tds.length; i++) {
				if (tds[i].rowSpan > 1) {
					array.push(tds[i]);
					difference -= tds[i].colSpan;
				}
			}
		}
		return array;

	}

	/*
	 * This function explores the table and adds 
	 * a cell for each lacking one for each row
	 * to meet an even amount of cells.
	 */

	table.addLackingCells = function () {
		var sumRows = [];
		for (var i = 0; i < table.rows.length; i++) {
			sumRows.push(0);
		}

		for (var i = 0; i < table.rows.length; i++) {
			var tds = table.rows[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].rowSpan > 1) {
					for (var k = 1; k < tds[j].rowSpan; k++) {
						sumRows[i + k]++;
					}
				}
			}
		}

		for (var i = 0; i < table.rows.length; i++) {
			var tds = table.rows[i].getElementsByTagName('td'),
				totalColspan = 0;
			for (var j = 0; j < tds.length; j++) {
				totalColspan += tds[j].colSpan;
			}
			totalColspan += sumRows[i];
			difference = maxAmountOfCells - totalColspan;
			for (var j = 0; j < difference; j++) {
				var td = new WPTB_Cell(mark);
				table.rows[i].appendChild(td.getDOMElement());
			}
		}

	};

	/*
	 * This function deletes the row of currently
	 * selected cell. 
	 */

	table.deleteRow = function () {

		var cell = document.querySelector('.wptb-highlighted'),
			row = getCoords(cell)[0],
			reduct = table.findRowspannedCells(row);

		for (i = 0; i < reduct.length; i++) {
			reduct[i].rowSpan--;
		}

		table.getElementsByTagName('tbody')[0].removeChild(table.rows[row]);
		array.pop();
		undoSelect();
		table.addLackingCells();
	}

	/*
	 * This function deletes the column of currently
	 * selected cell. Again, this is way more complicated than
	 * delete row case.
	 */

	table.deleteColumn = function () {

		var cell_ref = document.querySelector('.wptb-highlighted'),
			column = getCoords(cell_ref)[1],
			buffer, cell,
			carriedRowspans = [];

		for (var i = 0; i < maxAmountOfCells; i++) {
			carriedRowspans.push(0);
		}

		for (var i = 0; i < table.rows.length; i++) {
			buffer = table.rows[i].getElementsByTagName('td');
			stepsToMove = 1;
			cellPointer = 0;
			for (var j = 0; j < maxAmountOfCells; j += stepsToMove) {

				stepsToMove = 1;

				if (carriedRowspans[j] == 0) {
					cell = buffer[cellPointer++];
					if (cell.rowSpan > 1) {
						stepsToMove = cell.colSpan;
						for (var k = 0; k < cell.colSpan; k++) {
							carriedRowspans[j + k] = cell.rowSpan;
						}
						if (column > j && column <= j + k - 1) {
							//cell.style.backgroundColor = 'pink';
							cell.colSpan--;
							break;
						}
					} else if (cell.colSpan > 1) {
						stepsToMove = cell.colSpan;

						if (column > j && column <= j + cell.colSpan - 1) {
							//cell.style.backgroundColor = 'pink';
							cell.colSpan--;
							break;
						}
					}
					{
						if (column == j) {
							table.rows[i].removeChild(cell);
							//cell.style.backgroundColor = 'pink';
							break;
						}
					}
				} else {
					continue;
				}
			}

			for (var l = 0; l < carriedRowspans.length; l++) {
				if (carriedRowspans[l] > 0) {
					carriedRowspans[l]--;
				}

			}
		}
		maxAmountOfCells--;

		for (var i = 0; i < table.rows.length; i++) {
			if (array[i] != undefined)
				array[i].pop();
		}
		undoSelect();
	};

	document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

	array = fillTableArray();

	undoSelect();
	drawTable(array);

	wptbTableSetup.appendChild(table);

	table.recalculateIndexes();

	WPTB_LeftPanel();


};