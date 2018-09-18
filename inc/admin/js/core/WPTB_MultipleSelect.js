var MultipleSelect = function () {

	var selectedCells = [],
		multipleCellMode = false;

	this.activateMultipleSelectMode = function () {
		selectedCells = [];
		var tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
		for (var i = 0; i < tds.length; i++) {
			tds[i].classList.remove('wptb-highlighted');
		}
		multipleCellMode = true;
	}

	this.deactivateMultipleSelectMode = function () {
		console.log(selectedCells);
		multipleCellMode = false;
	}

	this.pushSelectedCell = function (cell) {
		if (!multipleCellMode) {
			return;
		}
		selectedCells.push(cell);
		cell.classList.add('wptb-highlighted');
	};

	this.selectedCells = function () {
		return selectedCells;
	}

	this.flushSelectedCells = function () {
		selectedCells = [];
	}

	this.getFirst = function () {
		var minXIndex = 1000, minYIndex = 1000, first;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (minXIndex >= selectedCells[i].dataset.xIndex
				&& minYIndex >= selectedCells[i].dataset.yIndex) {
				first = selectedCells[i];
				minXIndex = selectedCells[i].dataset.xIndex;
				minYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return first;
	}

	this.getLast = function () {
		var maxXIndex = -1, maxYIndex = -1, last;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (maxXIndex <= selectedCells[i].dataset.xIndex
				&& maxYIndex <= selectedCells[i].dataset.yIndex) {
				last = selectedCells[i];
				maxXIndex = selectedCells[i].dataset.xIndex;
				maxYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return last;
	}

	this.removeAllButFirst = function(){
		var td = this.getFirst(), p, i;
		for (i = 0; i < selectedCells.length; i++) {
			if(selectedCells[i] == td){
				continue;
			}
		    p = selectedCells[i].parentNode;
		    p.removeChild(selectedCells[i]);
		}
		selectedCells = [td];
	}

	this.changeRemovalClass = function(formerX,formerY){
		var td = this.getFirst(),
			formerClass = 'wptb-fused-cell-'+formerX+'-'+formerY;

		for (var i = 1; i < selectedCells.length; i++) {
			selectedCells[i].classList.add('wptb-fused-cell-' + td.dataset.xIndex + '-' + td.dataset.yIndex);
		}
		for(;selectedCells.length;)
		{
		    selectedCells[i].classList.remove('wptb-fused-cell-'+td.dataset.xIndex+'-'+td.dataset.yIndex);
		    console.log('Length after cycle:',console.log(selectedCells[i]));
		}
	}

	return this;

};