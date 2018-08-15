(function ($) {
    
    //When dragging starts for all elements from Add Items panel

    window.itemDragStart = function(event) {

        event.preventDefault();

        if ( ! event.target.classList.contains('wptb-draggable-prototype')  ) {
                    return;
                }
        
        var dragEl = event.target;

        while(! dragEl.classList.contains('wptb-element')){
            dragEl = dragEl.parentNode;
        }
        
        
        window.currentlyDragging = true;
        window.elementToDrag = dragEl.cloneNode(true);
        window.elementToDrag.style.position='absolute';
        window.elementToDrag.style.zIndex = '110000';
        window.elementToDrag.style.left = event.clientX+'px';
        window.elementToDrag.style.top = event.clientY+'px'; 
        window.elementToDrag.style.width = 'auto';
        window.elementToDrag.classList.remove('wptb-draggable-prototype');
        window.elementToDrag.classList.add('wptb-draggable');
        document.body.classList.add('wptb-state-dragging');
        document.body.appendChild(window.elementToDrag);
       /* window.currentlyDragging = true;
        wptbElement = event.target.id.substring(5, event.target.id.length);
 
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("text/plain", event.target.getAttribute('id')); */
    }

    window.putItemDragStart = function(){
        var temp = this;
        
        while(!temp.classList.contains('wptb-ph-element')){
            temp = temp.parentNode;
        } 
 
        window.alreadyPut = true;
        window.currentlyDragging = true;
        window.elementToDrag = temp;
        window.elementToDrag.style.position='absolute';
        window.elementToDrag.style.zIndex = '110000';
        window.elementToDrag.style.left = event.clientX+'px';
        window.elementToDrag.style.top = event.clientY+'px'; 
        window.elementToDrag.style.width = 'auto'; 
        document.body.classList.add('wptb-state-dragging');
        window.nextSpace = temp.nextSibling;
    }

    /*
    This function, checking if there is currently an element being dragged,
    updates its position on the screen. I see coming the hardest part: to put it inside
    a droppable element, but without using droppable.
    */

        window.onmousemove = function(event){
        event.preventDefault();
 

        if(window.currentlyDragging === undefined ){ 
            return;
        } 
        if(window.alreadyPut){
            var offsetX = document.getElementsByClassName('wptb-builder-panel')[0].getBoundingClientRect().x,
                offsetY = document.getElementsByClassName('wptb-builder-panel')[0].getBoundingClientRect().y;
           
            window.elementToDrag.style.left = (event.clientX - offsetX + 15)+'px';
            window.elementToDrag.style.top = (event.clientY - offsetY + 15)+'px';
        }
        else{
            window.elementToDrag.style.left = event.clientX+'px';
            window.elementToDrag.style.top = event.clientY+'px';
        }
    };

    window.makeSpace = function(){
        var spaceBetween = document.createElement('div'),
                        insertHere = document.createElement('div'),
                        spanInsert = document.createElement('span'),
                        newNode, el =window.elementToDrag.id.substring(5,
            window.elementToDrag.id.length);

                    spaceBetween.onmouseover = function(evt){
                        if(window.currentlyDragging)
                        this.childNodes[0].style.display = 'block';
                    };

                    spaceBetween.onmouseout = function(evt){
                        this.childNodes[0].style.display = 'none';
                    };

                    spanInsert.innerHTML = 'Insert Here';
                    spaceBetween.classList.add('wptb-space-between');
                    insertHere.classList.add('wptb-insert-here');
                    spaceBetween.appendChild(insertHere);
                    insertHere.appendChild(spanInsert);
        return spaceBetween;
    }

    /*
     * This deletes absolute positioning and z-index from dragging item
     * 
     * @param object the node to cleanse
     */

    window.trimInlineStyle = function(el){
        el.style.top='auto';
        el.style.left='auto';
        el.style.position='relative';
        el.style.width='100%';
        el.style.zIndex='auto';
    }

    /*
     * Here we save ourselves a few code lines since this is made twice in next function
     * 
     * @param string the currently selected new item to create
     * @return object the new node
     */

    window.newItemProxy = function(el){
        if(el == 'list'){
                return window.newList();
            }
            else if(el == 'image'){
                return window.newImage();
            }   
            else if(el == 'text'){
                return window.newText();
            }
            else if(el == 'button'){
                return window.newButton();
            }
    }

    /* Well, this function has turned out to be so complicated
     * for me keeping track of it without notes.
     *
     */

        window.onmouseup = function(event){ 

            // There's nothing to do on mouse button being released if there is no item being dragged

        if(window.currentlyDragging == undefined ){
            return;
        }

        var p = window.elementToDrag.parentNode;

        // Item just can be dropped in spaces between elements or in empty cells
        
        if( ! event.target.classList.contains('wptb-droppable') 
            && ! event.target.classList.contains('wptb-space-between')
            && ! event.target.classList.contains('wptb-insert-here') ){
            window.currentlyDragging = undefined;

            if(alreadyPut == undefined){
                p.removeChild(window.elementToDrag);
            }
            else{
                window.trimInlineStyle(window.elementToDrag);
                alreadyPut = undefined;
            }

            window.elementToDrag = undefined;
            document.body.classList.remove('wptb-state-dragging');
            return;
        }  

        //If item is being released in a cell

        if(event.target.classList.contains('wptb-droppable')){
            
            var sp2 = window.makeSpace();

            console.log('Item is being released in a cell');
            
            if(event.target.innerHTML==''){
                var sp1 = window.makeSpace();
                event.target.appendChild(sp1);
            }
            
            if(window.alreadyPut == undefined)
            {
                var newNode = window.newItemProxy(window.elementToDrag.id.substring(5, 
                        window.elementToDrag.id.length));
                event.target.appendChild(newNode);
                event.target.appendChild(sp2);
                p.removeChild(window.elementToDrag);
                console.log('Additionally, we are creating a new item');
            }

            else
            {
                console.log('We are just moving an item');
                window.trimInlineStyle(window.elementToDrag);
                event.target.appendChild(window.elementToDrag);
                event.target.appendChild(sp2);

                if(window.nextSpace != undefined){
                    var p = window.nextSpace.parentNode;
                    p.removeChild(window.nextSpace);
                    window.nextSpace = undefined;
                }
            }

        }
        else{ // If item is being released in a space
            console.log('Item is being released in space');

            var p = event.target.parentNode.nextSibling,
                td = event.target; 

                while(!td.classList.contains('wptb-droppable')){
                    td = td.parentNode;
                }

            if(window.alreadyPut == undefined)
            {
            var newNode = window.newItemProxy(window.elementToDrag.id.substring(5, 
                        window.elementToDrag.id.length));
                
 

            if(p == null){
                td.appendChild(newNode);
                td.appendChild(window.makeSpace());
            }
            else{
                td.insertBefore(newNode,p);
                td.insertBefore(window.makeSpace(),p);
            }
            document.body.removeChild(window.elementToDrag);

            console.log('Additionally, we are creating a new item');

            }

            else
            {
            console.log('We are just moving an item');

            if(p == null){
                td.appendChild(window.elementToDrag);
                td.appendChild(window.makeSpace());
            }
            else{
                td.insertBefore(window.elementToDrag,p);
                td.insertBefore(window.makeSpace(),p);
            }
            window.trimInlineStyle(window.elementToDrag);
                
                if(window.nextSpace != undefined){
                    var p = window.nextSpace.parentNode;
                    p.removeChild(window.nextSpace);
                    window.nextSpace = undefined;
                }

            }

        }


        /*
        if(window.alreadyPut == undefined )
        { 
            

            if(! event.target.classList.contains('wptb-space-between')){
            event.target.appendChild(spaceBetween);  
            }
            else{
                var p = event.target.parentNode;

                 if(event.target.nextSibling != undefined){
                    p.insertBefore(newNode,event.target.nextSibling);
                }
                else{
                    p.appendChild(newNode);
                }
            }
        }
        else
        {
            window.elementToDrag.style.top='auto';
            window.elementToDrag.style.left='auto';
            window.elementToDrag.style.position='relative';
            window.elementToDrag.style.width='100%';
            window.elementToDrag.style.zIndex='auto';
            if(! event.target.classList.contains('wptb-space-between'))
            {
                event.target.appendChild(spaceBetween);  
            }
            else
            {  
                var p = event.target.parentNode;
                if(event.target.nextSibling != undefined){
                    p.insertBefore(window.elementToDrag,event.target.nextSibling);
                }
                else{
                    p.appendChild(window.elementToDrag);
                }
                
            }
        } */
            window.alreadyPut = undefined;
            document.body.classList.remove('wptb-state-dragging');
            window.currentlyDragging = undefined;
            window.elementToDrag = undefined;
    };

})(jQuery);