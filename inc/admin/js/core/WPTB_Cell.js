var WPTB_Cell = function ( callback, DOMElement ) {

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
            parentRow = td.parentNode,
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

        // Add Auto text field in each block
        let element = WPTB_Helper.newElementProxy( 'text' )
        element = element.getDOMElement();

        DOMElement.appendChild( element )
    }

    DOMElement.draggable = false;
    if ( callback ) {
        DOMElement.onclick = callback;
    }

    // Cell double click handler
    DOMElement.ondblclick = function( event ) {
        event.stopPropagation();
        let wptbTableSetup = document.querySelector('.wptb-table-setup')
        if(wptbTableSetup && !wptbTableSetup.classList.contains('wptb-preview-table-manage-cells') &&
            (event.target.dataset.yIndex !== '0' || wptbTableSetup.dataset.wptbSortableTable !== '1') &&
            event.target == event.currentTarget) {
            WPTB_Helper.wptbDocumentEventGenerate( 'table:cell:dblclick', event.target )

            let element = WPTB_Helper.newElementProxy( 'text' )
            element = element.getDOMElement()

            DOMElement.appendChild( element )

            WPTB_innerElementSet( element );
        }
    }

    WPTB_innerElementSet( DOMElement );

    WPTB_Helper.elementStartScript( DOMElement, 'table_cell_setting' );

    let wptbPhElement = DOMElement.getElementsByClassName( 'wptb-ph-element' );

    if ( wptbPhElement.length > 0 ) {
        for( let i = 0; i < wptbPhElement.length; i++ ) {
            wptbPhElement[i].getDOMElement = function() {
                return wptbPhElement[i];
            }

            WPTB_innerElementSet( wptbPhElement[i] );

            let wptbElementTypeClass = wptbPhElement[i].className.match( /wptb-element-((.+-)\d+)/i );
            if( wptbElementTypeClass && Array.isArray( wptbElementTypeClass ) ) {
                let wptbTypeElementArr = wptbElementTypeClass[1].split( '-' );
                wptbPhElement[i].kind = wptbTypeElementArr[0];
                applyGenericItemSettings( wptbPhElement[i], wptbElementTypeClass[1] );
                let wptbInternalActiveElement = wptbPhElement[i].getElementsByClassName( 'wptb-in-element' );
                if ( wptbInternalActiveElement.length > 0 ) {
                    for ( let j = 0; j < wptbInternalActiveElement.length; j++ ) {
                        let wptbInternalActiveElementObj = {};
                        wptbInternalActiveElementObj.getDOMElement = function() {
                            return wptbInternalActiveElement[j];
                        }

                        applyGenericItemSettings( wptbInternalActiveElementObj );
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

        let width = parseInt( this.offsetWidth, 10 ) -
            parseInt( tdPaddingLeft, 10 ) -
            parseInt( tdPaddingRight, 10 );

        let height = parseInt( this.offsetHeight, 10 ) -
            parseInt( tdPaddingTop, 10 ) -
            parseInt( tdPaddingBottom, 10 );
        let table = WPTB_Helper.findAncestor( this, 'wptb-preview-table' );
        if(table) {
            if(table.style.borderCollapse === 'collapse') {
                width = width - ( parseInt( tdBorderLeftWidth, 10 ) / 2 ) -
                    ( parseInt( tdBorderRightWidth, 10 ) / 2 );
                height = height - ( parseInt( tdBorderTopWidth, 10 ) / 2 ) -
                    ( parseInt( tdBorderBottomWidth, 10 ) / 2 );
                let tableFullStyleObj = window.getComputedStyle( table, null );
                let tableBorderLeft = tableFullStyleObj.getPropertyValue( 'border-left-width' );
                let tableBorderRight = tableFullStyleObj.getPropertyValue( 'border-right-width' );
                let tableBorderTop = tableFullStyleObj.getPropertyValue( 'border-top-width' );
                let tableBorderBottom = tableFullStyleObj.getPropertyValue( 'border-bottom-width' );

                let tr = this.parentNode;
                if( tr && tr.nodeName.toLowerCase() === 'tr' ) {
                    if( tr.firstChild && tr.firstChild.dataset.xIndex === this.dataset.xIndex ) {
                        if( parseInt( tableBorderLeft, 10 ) > parseInt( tdBorderLeftWidth, 10 ) ) {
                            width += -( parseInt( tableBorderLeft, 10 ) - parseInt( tdBorderLeftWidth, 10 ) ) / 2;
                        }
                    }

                    if( tr.lastChild && tr.lastChild.dataset.xIndex === this.dataset.xIndex ) {
                        if( parseInt( tableBorderRight, 10 ) > parseInt( tdBorderRightWidth, 10 ) ) {
                            width += -( parseInt( tableBorderRight, 10 ) - parseInt( tdBorderRightWidth, 10 ) ) / 2;
                        }
                    }

                    let body = tr.parentNode;
                    if( body && body.nodeName.toLowerCase() === 'body' ) {
                        if( body.firstChild && body.firstChild.firstChild.dataset.yIndex === this.dataset.yIndex ) {
                            if( parseInt( tableBorderTop, 10 ) > parseInt( tdBorderTopWidth, 10 ) ) {
                                height += ( parseInt( tableBorderTop, 10 ) - parseInt( tdBorderTopWidth, 10 ) ) / 2;
                            }
                        }

                        if( body.lastChild && body.lastChild.firstChild.dataset.yIndex === this.dataset.yIndex ) {
                            if( parseInt( tableBorderBottom, 10 ) > parseInt( tdBorderBottomWidth, 10 ) ) {
                                height += ( parseInt( tableBorderBottom, 10 ) - parseInt( tdBorderBottomWidth, 10 ) ) / 2;
                            }
                        }
                    }
                }
            } else if(table.style.borderCollapse === 'separate') {
                width = width - parseInt( tdBorderLeftWidth, 10 ) -
                    parseInt( tdBorderRightWidth, 10 );
                height = height - parseInt( tdBorderTopWidth, 10 ) -
                    parseInt( tdBorderBottomWidth, 10 );
            }
        }

        return {
            width: parseInt( width ),
            height: parseInt( height )
        };
    }

    return this;
};
