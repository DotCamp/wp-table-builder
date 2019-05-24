var WPTB_Cell = function (callback, DOMElement) {

    function highlightRow(td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
        for (var i = 0; i < tds.length; i++) {
            tds[i].classList.remove('highlighted-row-first', 'highlighted-row-last', 'highlighted-row-inner', 'highlighted-column-first', 'highlighted-column-last', 'highlighted-column-inner');
        }
        for (var i = 0; i < columnCount; i++) {

            var classToAdd = i == 0 ? 'highlighted-row-first' : i == columnCount - 1 ? 'highlighted-row-last' : 'highlighted-row-inner';
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
            var classToAdd = i == 0 ? 'highlighted-column-first' : i == rowCount - 1 ? 'highlighted-column-last' : 'highlighted-column-inner';
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

    return this;
};