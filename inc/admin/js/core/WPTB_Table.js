var WPTB_Table = function(columns, rows){
			
			var settings = document.getElementsByClassName('wptb-settings-items'),
				wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
				table, row, cell;

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
                cell = new WPTB_Cell();
                cell.setCoords(0,i); 
                row.appendChild(cell.getDOMElement()); 
            }

            //Add the data rows.
            for (var i = 1; i < rows; i++) {

                row = table.insertRow(-1);
                row.classList.add('wptb-row');

                for (var j = 0; j < columns; j++) {
                    cell = new WPTB_Cell();
                	cell.setCoords(i,j); 
                    row.appendChild(cell.getDOMElement());
                }
            }

    		table.recalculateIndexes = function(){
    			var trs = this.getElementsByTagName('tr'), tds, maxCols= 0;

		        for (var i = 0; i < trs.length; i++) {
		            tds = trs[i].getElementsByTagName('td');
		            for (var j = 0; j < tds.length; j++) {

		                if(i==0){ 
		                    tds[j].parentNode.className=''; 
		                    tds[j].parentNode.classList.add('wptb-row','wptb-table-head');
		                }
		                else{
		                    tds[j].parentNode.className=''; 
		                    tds[j].parentNode.classList.add('wptb-row'); 
		                }

		                tds[j].dataset.xIndex = j;
		                tds[j].dataset.yIndex = i;
		            }
		            if(j > maxCols){
		            	maxCols = j;
		            }
		        } 
		    	this.columns = maxCols; 
		    	console.log('Table dimensions: '+trs.length+' rows ,'+maxCols+' columns');
    		}

    		table.addColumn = function(pos){
		        var referenceTd, newTd, _this, xCoord;
		        referenceTd = this.getElementsByClassName('wptb-highlighted')[0];
		        console.log('Table',this.rows.length);
		        for (var i = 0; i < this.rows.length; i++) {
		            console.log('Iteration '+(i+1));
		            var newTd = new WPTB_Cell(); 

		            if(pos == 'before' || pos == 'after')
		            {
		        		xCoord = referenceTd.dataset.xIndex;
		                referenceTd = this.rows[i].getElementsByTagName('td')[0];
		                for (var  j= 0; j < xCoord; j++) {
		                	referenceTd = this.rows[i].childNodes[j];
		                }
		                
		                if(pos=='before'){
		        			console.log('referenceTd',referenceTd);
		                    this.rows[i].insertBefore(newTd.getDOMElement(),referenceTd);
		                    
		                    var buttons = document.getElementsByClassName('wptb-relative-action');
		                    for (var k = 0; k < buttons.length; k++) {
		                        buttons[k].dataset.xIndex++;
		                    } 
		                }
		                else{
		                    this.rows[i].insertBefore(newTd.getDOMElement(),referenceTd.nextSibling);
		                }
		            }
		            else if(pos=='end'){
		                this.rows[i].appendChild(newTd.getDOMElement());  
		            }
		            else{
		            	referenceTd = this.rows[i].getElementsByTagName('td')[0];
		            	this.rows[i].insertBefore(newTd.getDOMElement(),referenceTd);
		            }
		            table.columns++;
		        }

		        this.recalculateIndexes();
		    };

    		table.addColumnToTheEnd = function(evt){
		        table.addColumn('end',this.dataset.activeCell);
		    };

		    table.addColumnToTheStart = function(evt){
		        table.addColumn('start',this.dataset.activeCell);
		    };

		    table.addColumnBefore = function(){
		        table.addColumn('before',this.dataset.activeCell);
		    };

		    table.addColumnAfter = function(){
		        table.addColumn('after',this.dataset.activeCell);
		    };

    		table.addRow = function(pos){
    			var _this, row, referenceRow = undefined;
		            
		        if(pos == 'end' || pos == 'start'){ 
		            row = this.insertRow( pos == 'end' ? -1 : 0);
		        }else{
		            row = document.createElement('tr');
		        }
		            
		        for (var j = 0; j < this.columns; j++) {
		            var cell = new WPTB_Cell();
		            row.appendChild(cell.getDOMElement());
		        }

		        row.classList.add('wptb-row'); 

		        if(pos == 'before' || pos == 'after' ){
		        	_this = this.getElementsByClassName('wptb-highlighted')[0];
		            referenceRow = this.getElementsByTagName('tr')[_this.dataset.yIndex];
		            if(pos == "before"){
		                this.getElementsByTagName('tbody')[0].insertBefore(row,referenceRow);
		                var buttons = document.getElementsByClassName('wptb-relative-action');
		                for (var i = 0; i < buttons.length; i++) {
		                    buttons[i].dataset.yIndex++;
		                } 
		            }else{
		                this.getElementsByTagName('tbody')[0].insertBefore(row,referenceRow.nextSibling);
		            }
		        }

		        if(pos =='before' || pos == 'start'){
		        	var active = document.querySelector('wptb-highlighted');
		        	if(active){
		        		active.onclick();
		        	}
		        }

		        this.recalculateIndexes();
    		};

    		table.addRowToTheEnd = function(evt){
		        table.addRow('end');
		    };

		    table.addRowToTheStart = function(evt){
		        table.addRow('start');
		    };

		    table.addRowBefore = function(){
		        table.addRow('before');
		    };

		    table.addRowAfter = function(){
		        table.addRow('after');
		    };

		    table.deleteRow = function(e){	        
		        var cell = document.getElementsByClassName('wptb-highlighted')[0],
		        	index = cell.dataset.yIndex,
		        	table = document.getElementsByClassName('wptb-preview-table')[0],
		            row = table.getElementsByTagName('tr')[index],
		            rowCount = table.rows.length,
		            tbody = row.parentNode;
		        if((rowCount==1 && columnCount==1) || tbody == undefined){
		             return;
		         }
		        tbody.removeChild(row);  
		        this.recalculateIndexes();
		    };

		    table.deleteColumn= function(e){
		        var cell = document.getElementsByClassName('wptb-highlighted')[0],
		        	num = cell.dataset.xIndex,
		        	table = document.getElementsByClassName('wptb-preview-table')[0],
		            rowCount = table.rows.length;

		        if((rowCount==1 && columnCount==1)){
		             return;
		         }
		        for (var i = 0; i < rowCount; i++) {
		             var td = table.getElementsByTagName('tr')[i].getElementsByTagName('td')[num],
		                tr = td.parentNode;
		             tr.removeChild(td);
		        }        
		        this.recalculateIndexes();
		    };

		    table.mergeCells = function(){	    	
		        var firstCell = document.select.getFirst(),
		            lastCell = document.select.getLast(),
		            colspan = Math.abs(lastCell.dataset.xIndex - firstCell.dataset.xIndex) + 1,
		            rowspan = Math.abs(lastCell.dataset.yIndex - firstCell.dataset.yIndex) + 1;

		            console.log(firstCell);
		            console.log(lastCell);
		            console.log(colspan+' '+rowspan);
		        
		        document.select.removeAllButFirst();
		        
		        if( colspan > 1 ){
		            firstCell.colSpan = colspan;
		        }

		        if( rowspan > 1 ){
		            firstCell.rowSpan = rowspan;
		        }
		        table.recalculateIndexes();
		    };

		    table.splitCell = function(){
		        var cell = document.getElementsByClassName('wptb-highlighted')[0],
		        	classn, hidden; 
		        if(cell.colSpan == 1 && cell.rowSpan == 1){
		        	return;
		        }

		        cell.colSpan = 1;
		        cell.rowSpan = 1;

		        classn = 'wptb-fused-cell-'+cell.dataset.xIndex+'-'+cell.dataset.yIndex;
		        hidden = document.getElementsByClassName(classn);
		        console.log('Initial:',hidden);

		        for (; hidden.length; ) {
		        	console.log(hidden[0]);
		        	hidden[0].classList.remove(classn);
		        }
		        table.recalculateIndexes();
		    };

            wptbTableSetup.appendChild(table);

            table.recalculateIndexes();

		    WPTB_LeftPanel();

             
};