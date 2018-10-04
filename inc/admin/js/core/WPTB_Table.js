var array = [], WPTB_Table = function (columns, rows) {

	var settings = document.getElementsByClassName('wptb-settings-items'),
		wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
		table, row, cell,
		maxAmountOfCells,
		maxAmountOfRows;

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
		}
		else {
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
		}
		else if (markedCells === 1) {
			for (var i = 0; i < multipleCells.length; i++) {
				multipleCells[i].classList.remove('visible');
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.remove('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.add('visible');
			}
		}
		else {
			for (var i = 0; i < multipleCells.length; i++) {
				if (table.isSquare(array)) {
					multipleCells[i].classList.add('visible');
				}
				else {
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

	for (var i = 0; i < settings.length; i++) {
		settings[i].classList.add('visible');
	}

	document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

	//Create a HTML Table element.
	table = document.createElement('table');
	table.classList.add('wptb-preview-table');

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
					}
					else {
						cols.push(1);
					}
				}
			}

			matriz.push(cols);

		}
		return matriz;
	};

	var carriedRowspans = function (row) {
		var carried = [], tds, cols;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carried[i] = 0;
		}

		if (row == -1) {
			return carried;
		}

		for (var i = 0; i <= row; i++) {
			bufferDeCeldas = table.rows[i].getElementsByTagName('td');
			punteroDeCelda = 0;

			for (var posicionEnPuntos = 0; posicionEnPuntos < maxAmountOfCells; posicionEnPuntos += desplazamiento) {
				desplazamiento = 1;

				if (carried[posicionEnPuntos]) {
					carried[posicionEnPuntos]--;
				}
				else {
					celda = bufferDeCeldas[punteroDeCelda++];
					if (celda.rowSpan > 1) {
						for (k = 0; k < celda.colSpan; k++) {
							carried[posicionEnPuntos + k] = celda.rowSpan - 1;
						}
						desplazamiento = celda.colSpan;
					}
					else if (celda.colSpan > 1) {
						desplazamiento = celda.colSpan;
					}
				}
			}

		}
		return carried;
	};

	table.toggleTableEditMode = function () {
		var bar = document.getElementById('edit-bar');
		if (bar.classList.contains('visible')) {
			document.select.deactivateMultipleSelectMode();
			bar.classList.remove('visible');
		}
		else {
			document.select.activateMultipleSelectMode();
			bar.classList.add('visible');

		}
	}

	table.recalculateIndexes = function () {
		var trs = this.getElementsByTagName('tr'), tds, maxCols = 0;

		for (var i = 0; i < trs.length; i++) {
			tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {

				if (i == 0) {
					tds[j].parentNode.className = '';
					tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
				}
				else {
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

	table.addColumnEnd = function () {
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			table.rows[i].appendChild(td.getDOMElement());
			array[i].push(0);
		}
		maxAmountOfCells++;
		undoSelect();
	};

	table.addColumnStart = function () {
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			firstCell = table.rows[i].getElementsByTagName('td')[0];
			if (firstCell) {
				table.rows[i].insertBefore(td.getDOMElement(), firstCell);
			}
			else {
				table.rows[i].appendChild(td.getDOMElement());
			}
			array[i].push(0);
		}

		maxAmountOfCells++;
		undoSelect();
	};

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

	table.addColumnAfter = function (c_pos) {
		var rows = table.rows,
			bufferDeCeldas,
			cell = document.querySelector('.wptb-highlighted'),
			pos = c_pos != undefined && typeof c_pos === 'number' ? c_pos : getCoords(cell)[1],
			insercionPendiente = false,
			desplazamiento,
			td, bro,
			carriedRowspans = [],
			currentCell;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carriedRowspans.push(0);
		}

		for (var i = 0; i < rows.length; i++) {
			punteroDeCelda = 0;
			bufferDeCeldas = rows[i].getElementsByTagName('td');
			insercionPendiente = false;
			for (var posicionEnPuntos = 0;
				posicionEnPuntos < maxAmountOfCells;
				posicionEnPuntos += desplazamiento) {
				desplazamiento = 1;

				if (insercionPendiente) {
					td = new WPTB_Cell(mark);
					td.getDOMElement().style.backgroundColor = 'black';

					if (currentCell && rows[i].contains(currentCell)) {
						bro = currentCell.nextSibling;
						if (bro) {
							rows[i].insertBefore(td.getDOMElement(), bro);
						}
						else {
							rows[i].appendChild(td.getDOMElement());
						}
					}
					else {
						rows[i].insertBefore(td.getDOMElement(), bufferDeCeldas[0]);
					}
					break;
				}
				else if (carriedRowspans[posicionEnPuntos] > 0) {
					if (pos == posicionEnPuntos) {
						insercionPendiente = true;
					}
				}
				else {
					currentCell = bufferDeCeldas[punteroDeCelda++];
					if (currentCell.rowSpan > 1) {
						desplazamiento = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							carriedRowspans[posicionEnPuntos + k] = currentCell.rowSpan;
							if (posicionEnPuntos + k == pos) {
								insercionPendiente = true;
							}
						}
					}
					else if (currentCell.colSpan > 1) {
						desplazamiento = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							if (posicionEnPuntos + k == pos) {
								insercionPendiente = true;
							}
						}
					}
					else if (posicionEnPuntos == pos) {
						insercionPendiente = true;
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

	table.addRowToTheEnd = function (evt) {
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

	table.addRowToTheStart = function (evt) {
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
			td.getDOMElement().style.backgroundColor = 'black';
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
					td.getDOMElement().style.backgroundColor = 'black';
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
			td.getDOMElement().style.backgroundColor = 'black';
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
					td.getDOMElement().style.backgroundColor = 'black';
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

	var undoSelect = function () {
		var tds = table.getElementsByClassName('wptb-highlighted');
		while (tds.length) {
			tds[0].classList.remove('wptb-highlighted');
		}
		for (var i = 0; i < array.length; i++) {

			for (var j = 0; j < array[i].length; j++) {
				array[i][j] = 0;
			}

		}
	};

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
		for (var i = 0; i < maxAmountOfRows; i++) {
			a[i] = [];
			for (var j = 0; j < maxAmountOfCells; j++) {
				a[i].push(0);
			}
		}
		drawTable(a);
		return a;
	};


	var getCoords = function (search) {
		var skipInCols = [], cell;

		for (var i = 0; i < maxAmountOfCells; i++) {
			skipInCols[i] = 0;
		}

		for (var i = 0; i < table.rows.length; i++) {
			var bufferDeCeldas = table.rows[i].getElementsByTagName('td');
			punteroDeCelda = 0;
			for (var posicionEnPuntos = 0; posicionEnPuntos < maxAmountOfCells; posicionEnPuntos += desplazamiento) {
				desplazamiento = 1;

				if (skipInCols[posicionEnPuntos]) {
					skipInCols[posicionEnPuntos]--;
				}
				else {
					var td = bufferDeCeldas[punteroDeCelda++];
					if (td == search) {
						return [i, posicionEnPuntos];
					}
					if (td.rowSpan > 1) {
						for (k = 0; k < td.colSpan; k++) {
							skipInCols[posicionEnPuntos + k] = td.rowSpan - 1;
						}
						desplazamiento = td.colSpan;
					}
					else if (td.colSpan > 1) {
						desplazamiento = td.colSpan;
					}
				}
			}
		}
	};

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

	table.splitCell = function () {
		var cell = document.getElementsByClassName('wptb-highlighted')[0],
			rowspan = cell.rowSpan,
			colspan = cell.colSpan;
		cell.rowSpan = 1;
		cell.colSpan = 1;
		for (var i = 0; i < rowspan; i++) {
			if (i == 0) {
				refCell = cell;
			}
			else {
				for (var k = 0, pt = 0; k < colspan; k += refCell.colSpan, pt++) {
					refCell = table.rows[i].getElementsByTagName('td')[pt];
					if (!refCell) {
						break;
					}
				}
			}

			var p = refCell ? refCell.parentNode : table.rows[i];
			for (var j = 0; j < colspan; j++) {
				if (!i && !j) {
					continue;
				}
				newCell = document.createElement('td');
				newCell.onclick = mark;
				if (refCell && refCell.nextSibling) {
					p.insertBefore(newCell, refCell.nextSibling)
				}
				else {
					p.appendChild(newCell);
				}
				refCell = newCell;
			}
		}
		undoSelect();

	};

	var getActualPointsInRow = function (row) {
		var tds = table.rows[row].getElementsByTagName('td'),
			points = 0;
		for (var i = 0; i < tds.length; i++) {
			points += tds[i].colSpan;
		}
		return points;
	}

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
			desplazamiento = 1;
			punteroDeCelda = 0;
			for (var j = 0; j < maxAmountOfCells; j += desplazamiento) {

				desplazamiento = 1;

				if (carriedRowspans[j] == 0) {
					cell = buffer[punteroDeCelda++];
					if (cell.rowSpan > 1) {
						desplazamiento = cell.colSpan;
						for (var k = 0; k < cell.colSpan; k++) {
							carriedRowspans[j + k] = cell.rowSpan;
						}
						if (column > j && column <= j + k - 1) {
							//cell.style.backgroundColor = 'pink';
							cell.colSpan--;
							break;
						}
					}
					else if (cell.colSpan > 1) {
						desplazamiento = cell.colSpan;

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
				}
				else {
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

	array = fillTableArray();

	undoSelect();
	drawTable(array);

	wptbTableSetup.appendChild(table);

	table.recalculateIndexes();

	WPTB_LeftPanel();

};