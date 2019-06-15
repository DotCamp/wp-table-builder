(function( $ ) {
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
        var wptbTableContainer = jQuery(".wptb-table-container");
        var sw = wptbTableContainer.width();
        if( wptbTableContainer.length > 0 ) {
            if (sw < 480) {
                wptbTableContainer.addClass("wptb-section-small");
            } else {
                wptbTableContainer.removeClass("wptb-section-small");
            }
        } 
    }
    wptb_tableContainerSectionSmall();
    
    //when window resize call wpcd_archiveSectionSmall.
    $( window ).resize( function () {
        wptb_tableContainerSectionSmall();
    });
});
