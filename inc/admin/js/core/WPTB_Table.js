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
    			var trs = this.getElementsByTagName('tr'), tds;

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
		        }
    		}

    		table.addColumn = function(pos){
		        var referenceTd, newTd, _this;
		        for (var i = 0; i < this.rows.length; i++) {
		            
		            var newTd = new WPTB_Cell(); 

		            if(pos == 'before' || pos == 'after')
		            {
		        		referenceTd = this.getElementsByClassName('wptb-highlighted')[0];
/*		                referenceTd = document.getElementsByClassName('wptb-table-setup')[0].rows[_this.dataset.yIndex]
		                        .getElementsByTagName('td')[_this.dataset.xIndex];*/
		                if(pos=='before'){
		                    this.rows[i].insertBefore(newTd.getDOMElement(),referenceTd);
		                    var buttons = document.getElementsByClassName('wptb-relative-action');
		                    for (var i = 0; i < buttons.length; i++) {
		                        buttons[i].dataset.xIndex++;
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

		    table.columns = columns;

            wptbTableSetup.appendChild(table);

		    WPTB_LeftPanel();

             
};