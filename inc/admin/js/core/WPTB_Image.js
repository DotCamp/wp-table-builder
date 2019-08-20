var WPTB_Image = function ( src, DOMElementProt ) {
        let DOMElement,
                elImage,
            kindIndexProt = undefined,
            copy = false;
        if ( DOMElementProt == undefined ) {
            DOMElement = document.createElement( 'div' );
            elImage = document.createElement( 'div' );
	    let anchor = document.createElement( 'a' ),
	    img = document.createElement( 'img' );
            anchor.style.display = 'block';
            anchor.appendChild( img );
            DOMElement.classList.add( 'wptb-image-container' );
            elImage.classList.add( 'wptb-image-wrapper' );
            elImage.appendChild( anchor );
            DOMElement.appendChild( elImage );
            
            anchor.onclick = function( e ) {
                e.preventDefault();
            }
            
            file_frame = wp.media.frames.file_frame = wp.media({
		title: 'Select a image to upload',
		button: {
                    text: 'Use this image'
		},
		multiple: false
            });
            // When an image is selected, run a callback.
            file_frame.on('select', function () {
                attachment = file_frame.state().get('selection').first().toJSON();
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
            });
            // Finally, open the modal
            if (src == undefined) {
                file_frame.open();
            } else {
                img.src = src;
            }
        } else {
            DOMElement = DOMElementProt.cloneNode( true );
            
            DOMElement.getElementsByTagName( 'a' )[0].onclick = function(e) {
                e.preventDefault();
            };
            
            let wptbElementMutch = DOMElementProt.className.match( /wptb-element-((.+-)\d+)/i );
            if ( wptbElementMutch && Array.isArray( wptbElementMutch ) ) {
                kindIndexProt = wptbElementMutch[1];
                copy = true;
            };
        }
            
        this.kind = 'image';
        this.getDOMElement = function () {
            return DOMElement;
        };
	applyGenericItemSettings( this, kindIndexProt, copy );

	return this;
};