let a = element.querySelector( 'a' );
let target = a.querySelector( 'div' );
a.onclick = function( e ) {
    e.preventDefault();
};
if( target ) {
    tinyMCE.init({
        target: target,
        inline: true,
        plugins: "link",
        dialog_type: "modal",
        theme: 'modern',
        menubar: false,
        fixed_toolbar_container: '#wpcd_fixed_toolbar',
        toolbar: 'bold italic strikethrough',
        setup : function(ed) {
            ed.on( 'keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
                let wptbButtonContainer = WPTB_Helper.findAncestor( target, 'wptb-button-container' );

                let wptbActionsField = new WPTB_ActionsField();

                wptbActionsField.addActionField( 1, wptbButtonContainer );

                wptbActionsField.setParameters( wptbButtonContainer );
            });

            ed.on( 'keyup', function(e) {
                let wptbButtonContainer = WPTB_Helper.findAncestor( target, 'wptb-button-container' );

                let wptbActionsField = new WPTB_ActionsField();

                wptbActionsField.addActionField( 1, wptbButtonContainer );

                wptbActionsField.setParameters( wptbButtonContainer );

                e.target.onblur = function() {
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
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
}

function textControlsChange( inputs, element ) {
    console.log("Hello");
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'button-id' ) ) {
            let buttonIdValue = inputs['button-id'];
            let a = element.getElementsByTagName( 'a' );
            if( a.length > 0 ) {
                a = a[0];
                a.setAttribute( 'id', buttonIdValue );
            }
        }
    } 
}

WPTB_Helper.controlsInclude( element, textControlsChange );

// for old elements which were before the change of structure of the plugin
let infArr = element.className.match( /wptb-size-([A-Z]+)/i );
if( infArr && Array.isArray( infArr ) ) {
    let wptbSize = infArr[0],
    wptbSizeNew = wptbSize.toLowerCase();

    element.classList.remove( wptbSize );

    let wptbButtonWrapper = element.querySelector( '.wptb-button-wrapper' );
    if( wptbButtonWrapper ) {
        wptbButtonWrapper.classList.add( wptbSizeNew );
    }
}

let infArrEl = element.className.match( /wptb-element-((.+-)\d+)/i );
let elementsSettingsTemplateJs  = document.getElementsByClassName( 'wptb-element-datas' );
let elementsSettings;
let elementSettings;
if( elementsSettingsTemplateJs.length > 0 ) {
    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];
    elementsSettings = elementsSettingsTemplateJs.innerHTML;
    if( elementsSettings ) {
        elementsSettings = JSON.parse( elementsSettings );
        if( typeof elementsSettings === 'object' && ( 'tmpl-wptb-element-datas-' + infArrEl[1] ) in elementsSettings ) {
            elementSettings = elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]];
        }
    }
} else {
    elementsSettingsTemplateJs = document.createElement( 'script' );
    elementsSettingsTemplateJs.setAttribute( 'type', 'text/html' );
    elementsSettingsTemplateJs.setAttribute( 'class', 'wptb-element-datas' );
    let body = document.getElementsByTagName('body')[0];
    body.appendChild( elementsSettingsTemplateJs );
}



if( ! elementSettings ) {
    if( ! elementsSettings || typeof elementsSettings !== 'object' ) {
        elementsSettings = {};
    }

    elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]] = {};
    let buttonId;
    let a = element.getElementsByTagName( 'a' );
    if( a.length > 0 ) {
        a = a[0];
        
        if( a.hasAttribute( 'id' ) ) {
            buttonId = a.getAttribute( 'id' );
            elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]]['data-wptb-el-' + infArrEl[1] + '-button-id'] = buttonId;
        } else {
            elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]]['data-wptb-el-' + infArrEl[1] + '-button-id'] = '';
        }

        if( elementsSettings ) {
            elementsSettings = JSON.stringify( elementsSettings );
            elementsSettingsTemplateJs.innerHTML = elementsSettings;
        }
    }
}