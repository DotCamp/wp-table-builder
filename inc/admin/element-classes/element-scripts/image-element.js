let a = element.getElementsByTagName( 'a' );
if( a.length > 0 ) {
    a = a[0];
}
a.onclick = function( e ) {
    e.preventDefault();
};

let img = element.getElementsByTagName( 'img' );
if( img.length > 0 ) {
    img = img[0];
}

let src;
if( img.src ) {
    src = img.src;
}

file_frame = wp.media.frames.file_frame = wp.media({
    title: 'Select a image to upload',
    button: {
        text: 'Use this image'
    },
    multiple: false,
    frame: 'post'
});

let imageSetting = function( img, attachment ) {
    let imgSrc = attachment.url;
    let linkArr = imgSrc.split( ':' ),
        linkClean;
    if ( Array.isArray( linkArr ) && linkArr.length > 0 ) {
        linkClean = linkArr[linkArr.length - 1];
    }
    img.src = linkClean;
    img.height = attachment.height;
    img.width = attachment.width;
    img.style.width = '100%';

    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    wptbTableStateSaveManager.tableStateSet();
};

file_frame.on( 'select', function() {
    attachment = file_frame.state().props.toJSON();
    imageSetting( img, attachment );
});

file_frame.on( 'insert', function () {
    attachment = file_frame.state().get( 'selection' ).first().toJSON();
    imageSetting( img, attachment );
});

if ( src == undefined ) {
    file_frame.open();
    file_frame.menuItemVisibility( 'gallery', 'hide' );
    file_frame.menuItemVisibility( 'playlist', 'hide' ), 
    file_frame.menuItemVisibility( 'video-playlist', 'hide' ), 
    file_frame.menuItemVisibility( 'audio-playlist', 'hide' )
} else {
    img.src = src;
}

function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'imageAlternativeText' ) ) {
            let imageAltValue = inputs['imageAlternativeText'];
            let img = element.getElementsByTagName( 'img' );
            if( img.length > 0 ) {
                img = img[0];
                img.setAttribute( 'alt', imageAltValue );
            }
        }
    } 
}

WPTB_Helper.controlsInclude( element, controlsChange );


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
    let imageAltText;
    let img = element.getElementsByTagName( 'img' );
    if( img.length > 0 ) {
        img = img[0];
        
        if( img.hasAttribute( 'alt' ) ) {
            imageAltText = img.getAttribute( 'alt' );
            elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]]['data-wptb-el-' + infArrEl[1] + '-imageAlternativeText'] = imageAltText;
        } else {
            elementsSettings['tmpl-wptb-element-datas-' + infArrEl[1]]['data-wptb-el-' + infArrEl[1] + '-imageAlternativeText'] = '';
        }
    }
    
    

    if( elementsSettings ) {
        elementsSettings = JSON.stringify( elementsSettings );
        elementsSettingsTemplateJs.innerHTML = elementsSettings;
    }
}