/* eslint-disable */
function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        let table = WPTB_Helper.findAncestor( element, 'wptb-preview-table' ),
            highlighted = table.querySelector( '.wptb-highlighted' );
        if( highlighted ) {
            let infArr = highlighted.className.match(/wptb-element-((.+-)\d+)/i);

            let controlUnicClassCommonPart = '';
            if(infArr && Array.isArray(infArr)) {
                controlUnicClassCommonPart = infArr[1]
            }

            if( inputs.hasOwnProperty( 'cellWidth' ) ) {
                table.addColumnWidth( inputs.cellWidth );

                if( controlUnicClassCommonPart ) {
                    let cellWidthFixedControl = document.querySelector(`.wptb-el-${controlUnicClassCommonPart}-cellWidthFixed`);

                    if(cellWidthFixedControl && !cellWidthFixedControl.checked) cellWidthFixedControl.checked = true;
                }
            } else if( inputs.hasOwnProperty( 'cellWidthFixed' ) ) {
                if(  inputs.cellWidthFixed == 'checked' ) {
                    let width = WPTB_Helper.getColumnWidth( table, highlighted );
                    table.addColumnWidth( width );
                } else {
                    table.addColumnWidth( false, true );
                }
            } else if( inputs.hasOwnProperty( 'cellHeight' ) ) {
                table.addRowHeight( inputs.cellHeight );

                if( controlUnicClassCommonPart ) {
                    let cellWidthFixedControl = document.querySelector(`.wptb-el-${controlUnicClassCommonPart}-cellHeightFixed`);

                    if(cellWidthFixedControl && !cellWidthFixedControl.checked) cellWidthFixedControl.checked = true;
                }
            } else if( inputs.hasOwnProperty( 'cellHeightFixed' ) ) {
                if( inputs.cellHeightFixed == 'checked' ) {
                    let height = WPTB_Helper.getRowHeight( table, highlighted );
                    table.addRowHeight( height );
                } else {
                    table.addRowHeight( false, true );
                }
            } else if (inputs.hasOwnProperty("hideColumnOnMobile")) {
                const siblings = [...highlighted.parentNode.children];
                const index = siblings.indexOf(highlighted);
                const tableData = [...table.querySelectorAll("td")];
                const columnNum = table.columns;
                const colSiblings = tableData.filter((td, tdIndex) => tdIndex % columnNum == index);
                if (inputs.hideColumnOnMobile == "checked") {
                  colSiblings.map(sibling => {
                    sibling.classList.add("wptb-hide-on-mobile");
                  });
                } else {
                  colSiblings.map(sibling => {
                    sibling.classList.remove("wptb-hide-on-mobile");
                  });
                }
            }
        }
    }
}
WPTB_Helper.controlsInclude( element, controlsChange );