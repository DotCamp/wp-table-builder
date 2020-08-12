var WPTB_LeftPanel = function () {

    let table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
            e.dataTransfer.setData( 'wptbElIndic-' + this.dataset.wptbElement, 'wptbElIndic-' + this.dataset.wptbElement );
        }
    };
    
    if( table ) {
        let wptbTablesEditModeCloseButton = document.getElementsByClassName( 'wptb-table-edit-mode-close' );
        for ( let i = 0; i < wptbTablesEditModeCloseButton.length; i++ ) {
            wptbTablesEditModeCloseButton[i].onclick = WPTB_Helper.toggleTableEditMode;
        }
    };

    // this code hides the "element parameters" area
    // when clicked outside this element and its "tinymce" toolbar 
    let wptbBuilderPanel = document.getElementsByClassName( 'wptb-builder-panel' )[0];
    wptbBuilderPanel.onclick = function( e ) {
        if( ! e.target.classList.contains( 'wptb-ph-element' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-ph-element' ) && 
               ! e.target.classList.contains( 'wptb-fixed-toolbar' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-fixed-toolbar' ) ) {
            WPTB_Helper.clickOnFreeSpace();
        } 
    };
   
    let wptbHeader = document.getElementsByClassName( 'wptb-header' );
    if( wptbHeader.length > 0 ) wptbHeader = wptbHeader[0];
    wptbHeader.onclick = function() {
        WPTB_Helper.clickOnFreeSpace();
    };
};