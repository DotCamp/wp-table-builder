function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'starCount' ) ) {
            let inputValue = inputs.starCount;

            let starRatings = element.querySelectorAll( 'li' );

            let starRatingsCount = starRatings.length;

            if( inputValue > starRatingsCount ) {
                let difference = inputValue - starRatingsCount;
                let starRatingsLast = starRatings[starRatings.length - 1];

                let parent = starRatingsLast.parentNode;
                for( let i = 0; i < difference; i++ ){
                    let newStarRating = starRatingsLast.cloneNode( true );
                    newStarRating.removeAttribute( 'class' );
                    newStarRating.setAttribute( 'class', 'wptb-rating-star' );
                    newStarRating.dataset.value = parseInt(starRatingsLast.dataset.value) + i + 1;
                    starRatingEventHandlersAdd( newStarRating );
                    parent.appendChild( newStarRating );
                }
            } else if( inputValue < starRatingsCount ) {
                if( inputValue <= 0 ) inputValue = 1;
                let difference = parseInt( starRatingsCount ) - parseInt( inputValue );

                if( inputValue == 0 ) {
                    difference--;
                    starRatings[0].removeAttribute( 'class' );
                    starRatings[0].setAttribute( 'class', 'wptb-rating-star' );
                    starRatings[0].style.display = 'none';
                }

                let starRatingLength = starRatings.length;
                for( i = 0; i < difference; i++ ) {
                    starRatings[0].parentNode.removeChild( starRatings[starRatingLength - i - 1] );
                }
            } else if( inputValue == starRatingsCount && starRatingsCount == 1 ) {
                starRatings[0].style.display = 'inline-block';
            }

            starRatingNumberRatingChenge( element );
        } else if( inputs.hasOwnProperty( 'numberRatingShowHide' ) ) {
            let wptbNumberRatingBox = element.querySelector( '.wptb-number-rating-box' );
            if( wptbNumberRatingBox ) {
                let inputValue = inputs['numberRatingShowHide'];
                if( inputValue == 'checked' ) {
                    wptbNumberRatingBox.style.display = 'block';
                } else if( inputValue == 'unchecked' ) {
                    wptbNumberRatingBox.style.display = 'none';
                }
            }
        }
    } 
}

WPTB_Helper.controlsInclude( element, controlsChange );

//WPTB_Helper.controlsInclude( element, onOffControlsChange );

let ratingStars = element.getElementsByClassName( 'wptb-rating-star' );
for ( let i = 0; i < ratingStars.length; i++ ) {
    let ratingStar = ratingStars[i];


    starRatingEventHandlersAdd( ratingStar );

    let ritingStarZeroSet = ratingStar.querySelector( '.wptb-rating-star-zero-set' );
    if( ritingStarZeroSet ) {
        ritingStarZeroSet.onclick = function( event ) {
            let ulStarList = WPTB_Helper.findAncestor( event.target, 'wptb-rating-stars-list' );
            if( ulStarList ) {
                let children = ulStarList.children;
                for( let i = 0; i < children.length; i++ ) {
                    children[i].classList.remove( 'wptb-rating-star-selected-full' );
                    children[i].classList.remove( 'wptb-rating-star-selected-half' );
                }
            }
        }
    }
}

function starRatingSelectHoverSet( event ) {
    let starRating;
    if( ! event.target.classList.contains( 'wptb-rating-star' ) ) {
        starRating = WPTB_Helper.findAncestor( event.target, 'wptb-rating-star' );
    } else {
        starRating = event.target;
    }

    let onStar = parseInt( starRating.dataset.value, 10 ); 

    let children = starRating.parentNode.children;
    if( event.type == "mouseover" ) {
        for( let j = 0; j < children.length; j++ ) {
            if( j < onStar ) {
                if( j == onStar - 1 ) {
                    if ( event.target.classList.contains( 'wptb-rating-star-left-signal-part' ) ) {
                        children[j].classList.add( 'wptb-rating-star-hover-half' );
                        children[j].classList.remove( 'wptb-rating-star-hover-full' );
                    } else if( event.target.classList.contains( 'wptb-rating-star-right-signal-part' ) ) {
                        children[j].classList.add( 'wptb-rating-star-hover-full' );
                        children[j].classList.remove( 'wptb-rating-star-hover-half' );
                    }
                } else {
                    children[j].classList.add( 'wptb-rating-star-hover-full' );
                    children[j].classList.remove( 'wptb-rating-star-hover-half' );
                }
            } else {
                children[j].classList.remove( 'wptb-rating-star-hover-full' );
                children[j].classList.remove( 'wptb-rating-star-hover-half' );
            }
        }
    } else if ( event.type == "click" ) {
        for( let j = 0; j < children.length; j++ ) {
            if( j < onStar ) {
                if( j == onStar - 1 ) {
                    if ( event.target.classList.contains( 'wptb-rating-star-left-signal-part' ) ) {
                        children[j].classList.add( 'wptb-rating-star-selected-half' );
                        children[j].classList.remove( 'wptb-rating-star-selected-full' );
                    } else if( event.target.classList.contains( 'wptb-rating-star-right-signal-part' ) ) {
                        children[j].classList.add( 'wptb-rating-star-selected-full' );
                        children[j].classList.remove( 'wptb-rating-star-selected-half' );
                    }
                } else {
                    children[j].classList.add( 'wptb-rating-star-selected-full' );
                    children[j].classList.remove( 'wptb-rating-star-selected-half' );
                }
            } else {
                children[j].classList.remove( 'wptb-rating-star-selected-full' );
                children[j].classList.remove( 'wptb-rating-star-selected-half' );
            }
        }
    }
};

function starRatingEventHandlersAdd( ratingStar ) {
    ratingStar.onmouseover = function( event ) {
        event.stopPropagation();
        starRatingSelectHoverSet( event );
    };

    ratingStar.onmouseout = function() {
        let children = this.parentNode.children;
        for( let j = 0; j < children.length; j++ ) {
            children[j].classList.remove( 'wptb-rating-star-hover-half' );
            children[j].classList.remove( 'wptb-rating-star-hover-full' );
        }
    };

    ratingStar.onclick = function( event ) {
        event.stopPropagation();
        starRatingSelectHoverSet( event );

        let wptbStarRatingContainer = WPTB_Helper.findAncestor( event.target, 'wptb-star_rating-container' );
        
        

        starRatingNumberRatingChenge( wptbStarRatingContainer );

        let wptbActionsField = new WPTB_ActionsField( 1, wptbStarRatingContainer );

        wptbActionsField.setParameters( wptbStarRatingContainer );

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
};

function starRatingNumberRatingChenge( starRatingContainer ) {
    let ratingNumber = starRatingContainer.getElementsByClassName( 'wptb-rating-star-selected-full' ).length;
    if( starRatingContainer.getElementsByClassName( 'wptb-rating-star-selected-half' ).length > 0 ) {
        ratingNumber = parseInt( ratingNumber ) + 0.5;
    }

    let wptbNumberRatingCommon = starRatingContainer.querySelectorAll( 'li' );
    let wptbNumberRatingCommonVal = wptbNumberRatingCommon.length;
    let wptbNumberRating = starRatingContainer.querySelector( '.wptb-number-rating' );
    if( wptbNumberRatingCommonVal == 1 && wptbNumberRatingCommon[0].style.display == 'none' ) {
        wptbNumberRating.innerHTML = '';
        return;
    }

    wptbNumberRating.innerHTML = ratingNumber + '/' + wptbNumberRatingCommonVal;
};

// for old elements which were before the change of structure of the plugin

if( ! element.dataset.starCount ) {
    let starsLi = element.querySelectorAll( '.wptb-rating-stars-list .wptb-rating-star' );
    element.dataset.starCount = starsLi.length;
}


let spans = element.querySelectorAll( 'li span' );
for( let i = 0; i < spans.length; i++ ) {
    if( spans[i].style.fill ) {
        let svgElem = spans[i].querySelector( 'svg' );
        if( svgElem && ! svgElem.style.fill ) {
            svgElem.style.fill = spans[i].style.fill;
        }

        spans[i].style.fill = '';
    }
}

let wptbSuccessBox = element.querySelector( '.wptb-success-box' );
if( wptbSuccessBox ) {
    wptbSuccessBox.classList.add( 'wptb-number-rating-box' );
    wptbTextMessage = wptbSuccessBox.querySelector( '.wptb-text-message' );

    if( wptbTextMessage ) {
        wptbTextMessage.classList.add( 'wptb-number-rating' );
    }
}