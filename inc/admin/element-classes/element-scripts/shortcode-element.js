let infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
let controlKey = 'textarea';
let elementControlTargetUnicClass = 'wptb-el-' + infArr[1] + '-' + controlKey;

tinyMCE.init({
    target: element.children[0],
    inline: true,
    plugins: "link, paste",
    dialog_type: "modal",
    theme: 'modern',
    menubar: false,
    force_br_newlines : false,
    force_p_newlines : false,
    forced_root_block : '',
    paste_as_text: true,
    toolbar: false,
    setup : function( ed ) {
        
        ed.on( 'input', function( e ) {
            let elementControlTextarea = document.getElementsByClassName( elementControlTargetUnicClass );
            if( elementControlTextarea.length > 0 ) {
                elementControlTextarea = elementControlTextarea[0];
                elementControlTextarea.value = ed.targetElm.textContent;
            }
            WPTB_Helper.controlsStateManager( elementControlTargetUnicClass, true );
        });
        
        ed.on( 'keydown', function( e ) {
            let div = e.target;
            let divText = div.innerHTML.replace( /\s+/g, ' ' ).trim();
            divText = divText.replace( /&nbsp;/g, '').trim();
            
            if( ! window.shortcodeElemKeyDown ) {
                window.shortcodeElemKeyDown = divText;
            }
        });
        
        ed.on( 'keyup', function(e) {
            let div = e.target;
            let divText = div.innerHTML.replace( /\s+/g, ' ' ).trim();
            divText = divText.replace( /&nbsp;/g, '').trim();
            if( divText !== window.shortcodeElemKeyDown ) {
                e.target.onblur = function() {
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();

                    window.shortcodeElemKeyDown = '';
                    e.target.onblur = '';
                }
            } else {
                e.target.onblur = '';
            }
        });
    }
});

element.addEventListener( 'wptb-control:' + elementControlTargetUnicClass, function( event ) {
    let targetElm = element.getElementsByClassName( 'mce-content-body' );
    if( targetElm.length > 0 ) {
        targetElm = targetElm[0];
        targetElm.innerText = event.detail.value;
    }
}, false );