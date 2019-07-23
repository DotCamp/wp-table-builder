var WPTB_Cell = function (callback, DOMElement) {

    function highlightRow(td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
        for (var i = 0; i < tds.length; i++) {
            tds[i].classList.remove('wptb-highlighted-row-first', 'wptb-highlighted-row-last', 'wptb-highlighted-row-inner', 'wptb-highlighted-column-first', 'wptb-highlighted-column-last', 'wptb-highlighted-column-inner');
        }
        for (var i = 0; i < columnCount; i++) {

            var classToAdd = i == 0 ? 'wptb-highlighted-row-first' : i == columnCount - 1 ? 'wptb-highlighted-row-last' : 'wptb-highlighted-row-inner';
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    }

    function highlightColumn(td) {

        var index,
            parentRow = td.parentNode;
        columnCount = parseInt(document.getElementById('wptb-columns-number').value), rowCount = parseInt(document.getElementById('wptb-rows-number').value), table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = i == 0 ? 'wptb-highlighted-column-first' : i == rowCount - 1 ? 'wptb-highlighted-column-last' : 'wptb-highlighted-column-inner';
            var tr = table.getElementsByTagName('tr')[i];
            if (tr.getElementsByTagName('td')[index] !== td) {
                tr.getElementsByTagName('td')[index].classList.add(classToAdd);
            }
        }
    }
    
    if( ! DOMElement ) {
        DOMElement = document.createElement("td");

        DOMElement.style.padding = jQuery('#wptb-table-padding-number').val() + 'px';

        var innerBorderWidth = jQuery('#wptb-table-inner-border-number').val();

        if (innerBorderWidth != '' && parseInt(innerBorderWidth) != 0) {
            DOMElement.style.border = innerBorderWidth + 'px solid ' + jQuery('#wptb-table-border-color').val();
        } 

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');
    }

    DOMElement.draggable = false;
    if ( callback ) {
        DOMElement.onclick = callback;
    }
    
    WPTB_innerElementSet( DOMElement );
    
    let wptbPhElement = DOMElement.getElementsByClassName( 'wptb-ph-element' );
                                            
    if ( wptbPhElement.length > 0 ) {
        for( let i = 0; i < wptbPhElement.length; i++ ) {

            let wptbSpaceBetween = DOMElement.getElementsByClassName( 'wptb-space-between' );

            if ( wptbSpaceBetween.length > 0 ) {
                for( let j = 0; j < wptbSpaceBetween.length; j++ ) {
                    WPTB_Space( wptbSpaceBetween[j] );
                }
            }
            
            wptbPhElement[i].getDOMElement = function() {
                return wptbPhElement[i];
            }
            
            WPTB_innerElementSet( wptbPhElement[i] );
            
            let wptbElementTypeClass = wptbPhElement[i].className.match( /wptb-element-((.+-)\d+)/i );
            if( wptbElementTypeClass && Array.isArray( wptbElementTypeClass ) ) {
                let wptbTypeElementArr = wptbElementTypeClass[1].split( '-' );
                wptbPhElement[i].kind = wptbTypeElementArr[0];
                applyGenericItemSettings( wptbPhElement[i], wptbElementTypeClass[1] );
                if ( wptbPhElement[i].kind == 'list' ) {
                    let wptbListItems = wptbPhElement[i].getElementsByTagName( 'li' );
                    if( wptbListItems.length > 0 ) {
                        for ( let i = 0; i < wptbListItems.length; i++ ) {
                            WPTB_ListItem( undefined, wptbListItems[i] );
                        }
                    }
                }
            }
        }
    }

    this.getDOMElement = function () {
        return DOMElement;
    };

    this.setCoords = function (y, x) {
        var el = this.getDOMElement();
        el.dataset.yIndex = y;
        el.dataset.xIndex = x;
    };

    this.getCoords = function () {
        var coords,
            el = this.getDOMElement();
        coords.x = el.dataset.xIndex;
        coords.y = el.dataset.yIndex;
        return coords;
    };

    this.appendElement = function (node) {
        getDOMElement().appendChild(node);
    };
    
    DOMElement.getCellDimensions = function() {
        let tdStyleObj = window.getComputedStyle( this, null );
        
        let tdPaddingLeft = tdStyleObj.getPropertyValue( 'padding-left' );
        let tdPaddingRight = tdStyleObj.getPropertyValue( 'padding-right' );
        
        let tdBorderLeftWidth = tdStyleObj.getPropertyValue( 'border-left-width' );
        let tdBorderRightWidth = tdStyleObj.getPropertyValue( 'border-right-width' );
        
        let tdPaddingTop = tdStyleObj.getPropertyValue( 'padding-top' );
        let tdPaddingBottom = tdStyleObj.getPropertyValue( 'padding-bottom' );
        
        let tdBorderTopWidth = tdStyleObj.getPropertyValue( 'border-top-width' );
        let tdBorderBottomWidth = tdStyleObj.getPropertyValue( 'border-bottom-width' );
        
        let width = parseFloat( this.offsetWidth, 10 ) - 
                    parseFloat( tdPaddingLeft, 10 ) - 
                    parseFloat( tdPaddingRight, 10 ) -
                    parseFloat( tdBorderLeftWidth, 10 ) -
                    parseFloat( tdBorderRightWidth, 10 );
            
        let height = parseFloat( this.offsetHeight, 10 ) - 
                    parseFloat( tdPaddingTop, 10 ) - 
                    parseFloat( tdPaddingBottom, 10 ) -
                    parseFloat( tdBorderTopWidth, 10 ) -
                    parseFloat( tdBorderBottomWidth, 10 );
        
        return {
            width: width, 
            height: height
        };
    }

    return this;
};