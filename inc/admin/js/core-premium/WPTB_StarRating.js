var WPTB_StarRating = function ( DOMElementProt ) {
    var DOMElement = document.createElement('div'),
        ratingStarsBox = document.createElement( 'div' ),
        ratingStarsList = document.createElement( 'ul' ),
        successBox = document.createElement( 'div' ),
        textMessage = document.createElement( 'div' ),
        kindIndexProt = undefined,
        copy = false;
    
    DOMElement.classList.add( 'wptb-star_rating-container' );
    ratingStarsBox.classList.add( 'wptb-rating-stars-box' );
    ratingStarsList.classList.add( 'wptb-rating-stars-list' );
    successBox.classList.add( 'wptb-success-box' );
    successBox.style.display = 'none';
    textMessage.classList.add( 'wptb-text-message' );
        
    let wptbRatingStarsArr = ['Poor', 'Fair', 'Good', 'Excellent', 'WOW!!!'];
    
    for( let i = 0; i < wptbRatingStarsArr.length; i++ ) {
        let ratingStar = document.createElement( 'li' );
        ratingStar.classList.add( 'wptb-rating-star' );
        ratingStar.dataset.value = i + 1;
        ratingStar.setAttribute( 'title', wptbRatingStarsArr[i] );
        ratingStarsList.appendChild( ratingStar );
    }

    successBox.appendChild( textMessage );
    ratingStarsBox.appendChild( ratingStarsList );
    ratingStarsBox.appendChild( successBox );
    DOMElement.appendChild( ratingStarsBox );
    
    

    
    // Creation of a new star rating when copying to avoid errors when assigning new event handlers.
    if ( DOMElementProt ) {
        let wptbElementMutch = DOMElementProt.className.match( /wptb-element-((.+-)\d+)/i );
        if ( wptbElementMutch && Array.isArray( wptbElementMutch ) ) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        };
        
        var wptbRatingStarsBox = DOMElementProt.querySelector( '.wptb-rating-stars-box' );
        if ( wptbRatingStarsBox ) {
            var wptbRatingStarsBoxAttributes = [...wptbRatingStarsBox.attributes];
            if ( wptbRatingStarsBoxAttributes.length > 0 ) {
                for( let i = 0; i < wptbRatingStarsBoxAttributes.length; i++ ) {
                    if ( wptbRatingStarsBoxAttributes[i].name == 'style') {
                        ratingStarsBox.setAttribute( wptbRatingStarsBoxAttributes[i].name, wptbRatingStarsBoxAttributes[i].value );
                    }
                } 
            }
        }
        
        let wptbRatingStarsOld = wptbRatingStarsBox.querySelectorAll( 'li' );
        let wptbRatingStars = ratingStarsList.querySelectorAll( 'li' );
        if ( wptbRatingStarsOld.length > 0 && wptbRatingStars.length > 0 ) {
            for( let i = 0; i < wptbRatingStarsOld.length; i++ ) {
                let  wptbRatingStarsAttributes = [...wptbRatingStarsOld[i].attributes];
                if ( wptbRatingStarsAttributes.length > 0 ) {
                    for( let j = 0; j < wptbRatingStarsAttributes.length; j++ ) {
                        wptbRatingStars[i].setAttribute( wptbRatingStarsAttributes[j].name, wptbRatingStarsAttributes[j].value );
                    } 
                }
            }
        }
        
        var wptbSuccessBox = wptbRatingStarsBox.querySelector( '.wptb-success-box' );
        if ( wptbSuccessBox ) {
            var wptbSuccessBoxAttributes = [...wptbSuccessBox.attributes];
            for( let i = 0; i < wptbSuccessBoxAttributes.length; i++ ) {
                if ( wptbSuccessBoxAttributes[i].name == 'style') {
                    successBox.setAttribute( wptbSuccessBoxAttributes[i].name, wptbSuccessBoxAttributes[i].value );
                }
            } 
        }
        
        var wptbTextMessage = wptbSuccessBox.querySelector( '.wptb-text-message' );
        if ( wptbTextMessage ) {
            textMessage.innerHTML = wptbTextMessage.innerHTML;
            var wptbTextMessageAttributes = [...wptbTextMessage.attributes];
            for( let i = 0; i < wptbTextMessageAttributes.length; i++ ) {
                if ( wptbTextMessageAttributes[i].name == 'style') {
                    textMessage.setAttribute( wptbTextMessageAttributes[i].name, wptbTextMessageAttributes[i].value );
                }
            } 
        }
    }
    
    this.kind = 'star_rating';

    this.getDOMElement = function () {
            return DOMElement;
    };

    applyGenericItemSettings( this, kindIndexProt, copy );
    
    return this;
}