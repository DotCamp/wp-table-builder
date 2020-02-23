let a = element.getElementsByTagName( 'a' );
if( a.length > 0 ) {
    a = a[0];
}
a.onclick = function( e ) {
    e.preventDefault();
};

let addMedia = function( element, imageChange = false ) {
    let img = element.querySelector( 'img' );

    let src;
    if( img && img.src ) {
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
        if( ! img  ) {
            img = document.createElement( 'img' );
            
            let a = element.getElementsByTagName( 'a' );
            if( a.length > 0 ) {
                a = a[0];
                a.innerHTML = '';
                
                a.appendChild( img );
            }
        }
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
        
        element.classList.remove( 'wptb-elem-placeholder' );

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

    if ( src == undefined || imageChange == true ) {
        file_frame.open();
        file_frame.menuItemVisibility( 'gallery', 'hide' );
        file_frame.menuItemVisibility( 'playlist', 'hide' ), 
        file_frame.menuItemVisibility( 'video-playlist', 'hide' ), 
        file_frame.menuItemVisibility( 'audio-playlist', 'hide' )
    } else {
        img.src = src;
    } 
}

let iconImageButton = element.querySelector( '.wptb-icon-image-button' );
if( iconImageButton ) {
    iconImageButton.onclick = function() {
        addMedia( element, true );
    }
}
    
if( iconImageButton && ! element.classList.contains( 'wptb-elem-placeholder' ) ) {
    element.classList.add( 'wptb-elem-placeholder' );
    addMedia( element );
}

function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'imageReplaceButton' ) ) {
            addMedia( element, true );
        }
    } 
}

WPTB_Helper.controlsInclude( element, controlsChange );
