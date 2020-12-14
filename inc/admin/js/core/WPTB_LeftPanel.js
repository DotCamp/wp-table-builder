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

        document.querySelector('#wptb-left-scroll-panel-curtain .wptb-table-edit-mode-close').addEventListener('click', () => {
            WPTB_Helper.toggleTableEditMode(true);
        })

        document.addEventListener('wptbSectionChanged', ({detail}) => {
            if(detail === 'manage_cells'){
                const wptbTablesEditModeCloseButtons = Array.from(document.querySelectorAll( '.wptb-management_table_container .wptb-table-edit-mode-close' ));
                wptbTablesEditModeCloseButtons.map(closeButton => {
                    closeButton.addEventListener('click', () => {
                        WPTB_Helper.toggleTableEditMode(true);
                    })
                })
            }
        })
    };

    // this code hides the "element parameters" area
    // when clicked outside this element and its "tinymce" toolbar 
    let wptbBuilderPanel = document.getElementsByClassName( 'wptb-builder-panel' )[0];
    wptbBuilderPanel.onclick = function( e ) {
        if( ! e.target.classList.contains( 'wptb-ph-element' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-ph-element' ) && 
               ! e.target.classList.contains( 'wptb-fixed-toolbar' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-fixed-toolbar' ) ) {
            if(WPTB_Helper.currentSection !== 'manage_cells'){

                WPTB_Helper.clickOnFreeSpace();
            }
        }
    };
   
    let wptbHeader = document.getElementsByClassName( 'wptb-header' );
    if( wptbHeader.length > 0 ) wptbHeader = wptbHeader[0];
    wptbHeader.onclick = function() {
        WPTB_Helper.clickOnFreeSpace();
    };
};