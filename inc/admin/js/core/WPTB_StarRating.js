var WPTB_StarRating = function ( DOMElementProt, countStarts ) {
    if( ! countStarts ) {
        if( ! DOMElementProt ) {
            countStarts = 5;
        } else {
            countStarts = DOMElementProt.querySelectorAll( 'li' ).length;
        }
    }
        
    let DOMElement = document.createElement('div'),
        ratingStarsBox = document.createElement( 'div' ),
        ratingStarsList = document.createElement( 'ul' ),
        numberRatingBox = document.createElement( 'div' ),
        textMessage = document.createElement( 'div' ),
        kindIndexProt = undefined,
        copy = false;
    
    DOMElement.classList.add( 'wptb-star_rating-container' );
    ratingStarsBox.classList.add( 'wptb-rating-stars-box' );
    ratingStarsList.classList.add( 'wptb-rating-stars-list' );
    numberRatingBox.classList.add( 'wptb-number-rating-box' );
    numberRatingBox.style.display = 'none';
    textMessage.classList.add( 'wptb-number-rating' );
    textMessage.style.fontSize = '25px';
    
    let filledRatingStarHtml = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" \n\
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" style="width: 20px;" viewBox="0 0 426.667 426.667" \n\
        style="enable-background:new 0 0 426.667 426.667;" xml:space="preserve">\n\
        <polygon points="426.667,165.12 273.28,152.107 213.333,10.667 153.387,152.107 0,165.12 \n\
        116.48,266.027 81.493,416 213.333,336.427 345.173,416 310.187,266.027"/></svg>';
    
    let notFilledRatingStarHtml = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" \n\
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" style="width: 20px;" viewBox="0 0 426.667 426.667" \n\
        style="enable-background:new 0 0 426.667 426.667;" xml:space="preserve">\n\
        <path d="M426.667,165.12L273.28,151.893L213.333,10.667l-59.947,141.44L0,165.12l116.48,100.907L81.493,416l131.84-79.573\n\
        L345.173,416L310.4,266.027L426.667,165.12z M213.333,296.533L133.12,344.96l21.333-91.307l-70.827-61.44l93.44-8.107 \n\
        l36.267-85.973l36.48,86.187l93.44,8.107l-70.827,61.44l21.333,91.307L213.333,296.533z"/></svg>';
    
    let halfFilledRatingStarHtml = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" \n\
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" style="width: 20px;" viewBox="0 0 426.667 426.667" \n\
        style="enable-background:new 0 0 426.667 426.667;" xml:space="preserve">\n\
        <path d="M426.667,165.12L273.28,151.893L213.333,10.667l-59.947,141.44L0,165.12l116.48,100.907L81.493,416l131.84-79.573 \n\
        L345.173,416L310.4,266.027L426.667,165.12z M213.333,296.533v-198.4l36.48,86.187l93.44,8.107l-70.827,61.44l21.333,91.307 \n\
        L213.333,296.533z"/></svg>';
    
    
    for( let i = 0; i < countStarts; i++ ) {
        let ratingStar = document.createElement( 'li' );
        ratingStar.classList.add( 'wptb-rating-star' );
        ratingStar.style.width = '20px';
        let ratingStarZeroSet = '';
        if( i == 0 ) {
            ratingStarZeroSet = '<span class="wptb-rating-star-zero-set"></span>';
        }
        
        ratingStar.innerHTML = '<span class="wptb-rating-star-left-signal-part">' + ratingStarZeroSet + '</span><span class="wptb-filled-rating-star">' + filledRatingStarHtml + '</span>'
                                + '<span class="wptb-not-filled-rating-star">' + notFilledRatingStarHtml + '</span>'
                                + '<span class="wptb-half-filled-rating-star">' + halfFilledRatingStarHtml + '</span><span  class="wptb-rating-star-right-signal-part"></span>';
        ratingStar.dataset.value = i + 1;
        ratingStarsList.appendChild( ratingStar );
    }

    numberRatingBox.appendChild( textMessage );
    ratingStarsBox.appendChild( ratingStarsList );
    ratingStarsBox.appendChild( numberRatingBox );
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
            let iMax = wptbRatingStarsOld.length < countStarts ? wptbRatingStarsOld.length : countStarts;
            for( let i = 0; i < wptbRatingStarsOld.length; i++ ) {
                let  wptbRatingStarsAttributes = [...wptbRatingStarsOld[i].attributes];
                if ( wptbRatingStarsAttributes.length > 0 ) {
                    for( let j = 0; j < wptbRatingStarsAttributes.length; j++ ) {
                        wptbRatingStars[i].setAttribute( wptbRatingStarsAttributes[j].name, wptbRatingStarsAttributes[j].value );
                    } 
                }
                
                let wptbRatingStarsOldSpan = wptbRatingStarsOld[i].children;
                let wptbRatingStarsSpan = wptbRatingStars[i].children;
                for( let k = 0; k < wptbRatingStarsOldSpan.length; k++ ){
                    let wptbRatingStarsOldSpanAttributes = [...wptbRatingStarsOldSpan[k].attributes];
                    if( wptbRatingStarsOldSpanAttributes.length > 0 ) {
                        for ( let l = 0; l < wptbRatingStarsOldSpanAttributes.length; l++ ) {
                            wptbRatingStarsSpan[k].setAttribute( wptbRatingStarsOldSpanAttributes[l].name, wptbRatingStarsOldSpanAttributes[l].value );
                            let wptbRatingStarsOldSvg = wptbRatingStarsOldSpan[k].querySelector( 'svg' );
                            if( wptbRatingStarsOldSvg ) {
                                let wptbRatingStarsOldSvgStyle = wptbRatingStarsOldSvg.getAttribute( 'style' );
                                wptbRatingStarsSpan[k].querySelector( 'svg' ).setAttribute( 'style', wptbRatingStarsOldSvgStyle );
                            }
                        }
                    }
                }
            }
        }
        
        var wptbNumberRatingBox = wptbRatingStarsBox.querySelector( '.wptb-number-rating-box' );
        if ( wptbNumberRatingBox ) {
            var wptbNumberRatingBoxAttributes = [...wptbNumberRatingBox.attributes];
            for( let i = 0; i < wptbNumberRatingBoxAttributes.length; i++ ) {
                if ( wptbNumberRatingBoxAttributes[i].name == 'style') {
                    numberRatingBox.setAttribute( wptbNumberRatingBoxAttributes[i].name, wptbNumberRatingBoxAttributes[i].value );
                }
            } 
        }
        
        var wptbTextMessage = wptbSuccessBox.querySelector( '.wptb-number-rating' );
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