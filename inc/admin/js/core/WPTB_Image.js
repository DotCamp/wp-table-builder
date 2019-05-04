var WPTB_Image = function ( src, DOMElement ) {
        let kindIndexProt;
        if ( DOMElement == undefined ) {
            var DOMElement = document.createElement('div'),
	    anchor = document.createElement('a'),
	    img = document.createElement('img');
            anchor.style.display = 'inline-block';
            anchor.appendChild(img);
            DOMElement.appendChild(anchor);
            
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
                    img.src = attachment.url;
            });
            // Finally, open the modal
            if (src == undefined) {
                    file_frame.open();
            } else {
                    img.src = src;
            }
        } else {
            var DOMElement = DOMElement.cloneNode( true );
            
            let wptbElementMutch = DOMElement.className.match( /wptb-element-((.+-)\d+)/i );
            if ( wptbElementMutch && Array.isArray( wptbElementMutch ) ) {
                kindIndexProt = wptbElementMutch[1];
            };
        }
	
            
        this.kind = 'image';
        this.getDOMElement = function () {
            return DOMElement;
        };
	applyGenericItemSettings( this, kindIndexProt );

	return this;
};