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
        document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
        document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
        document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
        document.getElementById('wptb-add-end-column').onclick = table.addColumnEnd;
        document.getElementById('wptb-add-start-column').onclick = table.addColumnStart;
        document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
        document.getElementById('wptb-delete-column').onclick = table.deleteColumn;
        document.getElementById('wptb-delete-row').onclick = table.deleteRow;
        document.getElementById('wptb-merge-cells').onclick = table.mergeCells;
        document.getElementById('wptb-split-cell').onclick = table.splitCell;
    };

    // TODO [erdembircan] old drawer toggle
    // document.querySelector( '.wptb-left-panel-extend' ).onclick = function() {
    //     let wptbContainer = document.querySelector( '.wptb-container' );
    //     if( wptbContainer ) {
    //         if ( wptbContainer.classList.contains( 'collapsed' ) ) {
    //             wptbContainer.classList.remove( 'collapsed' );
    //         } else {
    //             wptbContainer.classList.add( 'collapsed' );
    //         }
    //     }
    // };
    
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