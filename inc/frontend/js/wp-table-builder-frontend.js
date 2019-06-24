( function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
         * 
         * The file is enqueued from inc/frontend/class-frontend.php.
	 */
        
    

})( jQuery );

jQuery( document ).ready( function ( $ ) {
    /**
     * function wptb_tableContainerSectionSmall
     * add class ( wptb-section-small ) in small width
     * remove this class in large width
     * @returns {void}
     */
    function wptb_tableContainerSectionSmall() {
        let wptbTableContainer = jQuery(".wptb-table-container");
        let sw = wptbTableContainer.width();
        if( wptbTableContainer.length > 0 ) {
            if (sw < 480) {
                wptbTableContainer.addClass("wptb-section-small");
            } else {
                wptbTableContainer.removeClass("wptb-section-small");
            }
        }
    } 
    
    /**
     * function wptb_tableGenerateMobile
     * generates a mobile view of the table 
     * when the top row of the table is not a heading
     * @returns {void}
     */
    function wptb_tableGenerateMobile() {
        let wptbTableContainer = document.getElementsByClassName( 'wptb-table-container' );
        let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
        let wptbPreviewTableMobile = document.getElementsByClassName( 'wptb-preview-table-mobile' );
        if( wptbTableContainer.length > 0 && wptbPreviewTable.length > 0 ) {
            let sw = wptbTableContainer[0].offsetWidth;
            if (sw < 480) {
                wptbPreviewTable[0].style.display = 'none';
                
                if( wptbPreviewTableMobile.length == 0 ) {
                    let tableRows = wptbPreviewTable[0].rows;
                    let tableRowTop = tableRows[0];
                    let tableRowTopChildren = tableRowTop.children;
                    let columnCount = 0;

                    for( let i = 0; i < tableRowTopChildren.length; i++ ) {
                        columnCount += tableRowTopChildren[i].colSpan;
                    }

                    let newTableArray = [];

                    for( let i = 0; i < columnCount; i++ ) {
                        newTableArray[i] = [];
                    }
                    
                    for( let i = 0; i < tableRows.length; i++ ) {
                        let rowChildren = tableRows[i].children;

                        for( let j = 0; j < columnCount; j++ ) {
                            if( rowChildren[j].dataset.xIndex == j ) {
                                let tdNew = rowChildren[j].cloneNode( true );
                                if ( tableRows[i].style.backgroundColor ) {
                                    tdNew.style.backgroundColor = tableRows[i].style.backgroundColor;
                                }
                                newTableArray[j].push( tdNew );
                            } else {
                                newTableArray[j].push( '' );
                            }
                        }
                    }
                    
                    let table = document.createElement( 'table' );
                    table.classList.add( 'wptb-preview-table-mobile' );
                    let tableStyle = wptbPreviewTable[0].getAttribute( 'style' );
                    table.setAttribute( 'style', tableStyle );
                    table.style.display = 'table';
                    for ( let i = 0; i < columnCount; i++ ) {
                        let row = table.insertRow(-1);
                        row.classList.add( 'wptb-row' );
                        
                        for ( let j = 0; j < tableRows.length; j++ ) {
                            if( newTableArray[i][j] ) {
                                row.appendChild( newTableArray[i][j] );
                            }
                        }
                    }
                    
                    wptbTableContainer[0].appendChild( table );
                } else {
                    wptbPreviewTableMobile[0].style.display = 'table';
                }
                
            } else {
                wptbPreviewTable[0].style.display = 'table';
                if( wptbPreviewTableMobile.length > 0 ) {
                    wptbPreviewTableMobile[0].style.display = 'none';
                }
                
            }
        }
    }
    
    let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
    if ( wptbPreviewTable.length > 0 ) {
        wptbPreviewTable[0].style.display = 'table';
        if( ! wptbPreviewTable[0].classList.contains( 'wptb-table-preview-head' ) ) {
            wptb_tableGenerateMobile();
        }
        wptb_tableContainerSectionSmall();

        //when window resize call wpcd_archiveSectionSmall and wptb_tableGenerateMobile
        $( window ).resize( function () {
            if( ! wptbPreviewTable[0].classList.contains( 'wptb-table-preview-head' ) ) {
                wptb_tableGenerateMobile();
            }
            wptb_tableContainerSectionSmall();
        });
    }
    
});
