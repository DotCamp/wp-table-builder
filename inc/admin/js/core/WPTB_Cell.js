var WPTB_Cell = function(DOMElement){

		function newElementProxy(el){
			if(el == 'list'){
                return new WPTB_List();
            }
            else if(el == 'image'){
                return new WPTB_Image();
            }   
            else if(el == 'text'){
                return new WPTB_Text();
            }
            else if(el == 'button'){
                return new WPTB_Button();
            }
		}
        
        DOMElement = document.createElement("td");
        
        DOMElement.classList.add('wptb-droppable', 'wptb-cell');  

        DOMElement.onclick = function(){

        	var relativeActions, cells;

        	if(window._wptbManagementModeActive){
        		return;
        	}
        	if(this.classList.contains('wptb-highlighted')){
        		this.classList.remove('wptb-highlighted');
        	}
        	else{
        		relativeActions = document.getElementsByClassName('wptb-relative-action');
        		cells = document.getElementsByTagName('td');

        		for (var i = 0; i < relativeActions.length; i++) {
        			console.log(relativeActions[i]);
        			relativeActions[i].dataset.activeCell = this;
        		}

        		for (var i = 0; i < cells.length; i++) {
        			cells[i].classList.remove('wptb-highlighted');
        		}

        		this.classList.add('wptb-highlighted');

        	}
        	
        };

        DOMElement.ondragenter = function(){
        	var div;
        	this.classList.add('wptb-drop-here-empty');
        }

        DOMElement.ondragover = function(e){
        	e.preventDefault();
        }

        DOMElement.ondragleave = function(){
        	this.classList.remove('wptb-drop-here-empty');

        }

        DOMElement.ondrop = function(e){
        	var element,classId;
        	e.preventDefault();
            if(e.dataTransfer.getData('wptbElement')){
        	   element = newElementProxy(e.dataTransfer.getData('wptbElement'));
                this.appendChild(element.getDOMElement());
        	}
            else{
                classId = e.dataTransfer.getData('node');
                element = document.getElementsByClassName(classId)[0];
                this.appendChild(element);
            }
        	this.classList.remove('wptb-drop-here-empty');
        	return true;
        }

        DOMElement.onmousedown = function(){

        };

        DOMElement.onmouseover = function(){

        };

        DOMElement.onmouseup = function(){

        };

        this.getDOMElement = function (){ 
        	return DOMElement;
        }

        this.setCoords = function(y,x){
        	var el = this.getDOMElement();
        	el.dataset.yIndex = y;
        	el.dataset.xIndex = x;
        }

        this.getCoords = function(){
        	var coords,
        		el = this.getDOMElement();
        	coords.x = el.dataset.xIndex;
        	coords.y = el.dataset.yIndex;
        	return coords;
        }

        this.appendElement = function(node){
        	getDOMElement().appendChild(node);
        }

        return this;

};