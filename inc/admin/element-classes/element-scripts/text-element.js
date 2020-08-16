let tinyMceInitStart = function() {
    tinyMCE.init({
        target: element.childNodes[0],
        inline: true,
        plugins: "link, paste",
        dialog_type: "modal",
        theme: 'modern',
        menubar: false,
        force_br_newlines : false,
        force_p_newlines : false,
        forced_root_block : '',
        fixed_toolbar_container: '#wpcd_fixed_toolbar',
        paste_as_text: true,
        toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
        rel_list: [
            {title: 'None', value: ''},
            {title: 'nofollow', value: 'nofollow'}
        ],
        setup : function( ed ) {
            ed.on( 'change', function(e) {
                let row = WPTB_Helper.findAncestor( element, 'wptb-row' );
                if( WPTB_Helper.rowIsTop( row ) ) {
                    let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );

                    if( table.classList.contains( 'wptb-table-preview-head' ) ) {
                        WPTB_Helper.dataTitleColumnSet( table );
                    }
                }
            });

            ed.on( 'keydown', function( e ) {
                let p = e.target.querySelector( 'p' );
                let pText = p.innerHTML.replace( /\s+/g, ' ' ).trim();
                pText = pText.replace( /&nbsp;/g, '').trim();

                if( ! window.textElemPTextKeyDown ) {
                    window.textElemPTextKeyDown = pText;
                }
            });

            ed.on( 'keyup', function(e) {
                let p = e.target.querySelector( 'p' );
                let pText = p.innerHTML.replace( /\s+/g, ' ' ).trim();
                pText = pText.replace( /&nbsp;/g, '').trim();
                if( pText !== window.textElemPTextKeyDown ) {
                    e.target.onblur = function() {
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();

                        window.textElemPTextKeyDown = '';
                        e.target.onblur = '';
                    }
                } else {
                    e.target.onblur = '';
                }
            });
        },
        init_instance_callback: function (editor) {
            window.currentEditor = editor;
            editor.on('focus', function (e) {
                var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
                if (window.currentEditor &&
                    document.getElementById('wptb_builder').scrollTop >= 55 &&
                    window.currentEditor.bodyElement.style.display != 'none') {
                    document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
                    document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
                    document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
                } else {
                    document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
                    delete document.getElementById('wpcd_fixed_toolbar').style.right;
                    delete document.getElementById('wpcd_fixed_toolbar').style.top;
                }
            });
        }
    });

    element.removeEventListener( 'mouseover', tinyMceInitStart, false );
}

element.addEventListener( 'mouseover', tinyMceInitStart, false );
                
var observer = new MutationObserver( function( mutations ) {
    let row = WPTB_Helper.findAncestor( element, 'wptb-row' );
    if( row.classList.contains( 'wptb-table-head' ) ) {
        let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
        WPTB_Helper.dataTitleColumnSet( table );
    }
});
var config = { attributes: true, attributeFilter: ['style'] };
observer.observe( element, config );

function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'color' ) ) {
            let row = WPTB_Helper.findAncestor( element, 'wptb-row' );
            let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
            if( WPTB_Helper.rowIsTop( row ) && table.classList.contains( 'wptb-table-preview-head' ) ) {
                WPTB_Helper.dataTitleColumnSet( table );
            }
        }
    } 
}

WPTB_Helper.controlsInclude( element, controlsChange );