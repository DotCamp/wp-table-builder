var WPTB_ElementOptions = function ( element, index, kindIndexProt ) {

    var node = element.getDOMElement(), elemIdClass;

    prop = document.querySelector(".wptb-" + element.kind + "-options-prototype").cloneNode(true);
    prop.classList.remove("wptb-" + element.kind + "-options-prototype"); // remove prototype from the class
    elemIdClass = 'wptb-options-' + element.kind + "-" + index;

    var properties = prop.getElementsByClassName('wptb-element-property');

    for (var i = 0; i < properties.length; i++) {
        properties[i].dataset.element = elemIdClass;
    }

    prop.classList.add(elemIdClass);
    document.getElementById("element-options-group").appendChild(prop);
    
    if ( kindIndexProt ) {
        if ( element.kind == 'button' ) {
            let affectedEl = document.getElementsByClassName( 'wptb-element-' + kindIndexProt )[0],
                wptbButtonWrapper,
                wptbButtonA,
                wptbButton,
                wptbSize;
        
            if ( affectedEl ) {
                wptbSize = affectedEl.className.match(/wptb-size-([a-z]+)/i);
            }
            
            if( wptbSize && Array.isArray( wptbSize ) ) {
                var b = prop.getElementsByClassName('wptb-btn-size-btn');
                
                for ( var i = 0; i < b.length; i++ ) {
                    b[i].classList.remove( 'selected' );
                    
                    if ( b[i].innerHTML == wptbSize[1] ) {
                        b[i].classList.add( 'selected' );
                    }
                }
            }
            
            if( affectedEl ) {
                wptbButtonWrapper = affectedEl.getElementsByClassName( 'wptb-button-wrapper' );
                
                wptbButtonA = affectedEl.getElementsByTagName( 'a' );
                
                wptbButton = affectedEl.getElementsByClassName( 'wptb-button' );
            }
            
            if ( wptbButtonWrapper ) {
                let buttonAlignment = wptbButtonWrapper[0].style.justifyContent;

                var selectOptionVal='';
                if ( buttonAlignment == 'start' ) {
                    selectOptionVal = 'left';
                } else if ( buttonAlignment == 'center' || ! buttonAlignment ) {
                    selectOptionVal = 'center';
                } else if ( buttonAlignment == 'flex-end' ) {
                    selectOptionVal = 'right';
                }

                let elementButtonAlignmentSelect = prop.getElementsByClassName('wptb-button-alignment-btn');




                for ( var i = 0; i < elementButtonAlignmentSelect.length; i++ ) {
                        elementButtonAlignmentSelect[i].classList.remove( 'selected' );
                        
                        if ( elementButtonAlignmentSelect[i].getAttribute('data-button_alignment') == selectOptionVal ) {
                            elementButtonAlignmentSelect[i].classList.add( 'selected' );
                        }
                    }
            }
            
            if ( wptbButtonA.length > 0 ) {
                let buttonHref = wptbButtonA[0].getAttribute( 'href' ), 
                    buttonLinkTarget = wptbButtonA[0].getAttribute( 'target' ),
                    buttonId = wptbButtonA[0].getAttribute( 'id' ),
                    
                    
                    buttonHrefInput = prop.querySelector( 'input[data-type="button-link"]' ),
                    buttonLinkTargetInput = prop.querySelector( 'input[data-type="button-link-target"]' ),
                    buttonLinkTargetInputId = buttonLinkTargetInput.getAttribute( 'id' ),
                    buttonLinkTargetInputLabel = buttonLinkTargetInput.parentNode.getElementsByTagName( 'label' )[0],
            
                    buttotIdInput = prop.querySelector( 'input[data-type="button-id"]' );

                buttonLinkTargetInputId = buttonLinkTargetInputId + '-' + kindIndexProt.split( '-' )[1];
                buttonLinkTargetInput.setAttribute( 'id', buttonLinkTargetInputId );
                buttonLinkTargetInputLabel.setAttribute( 'for', buttonLinkTargetInputId );

                buttonHrefInput.value = buttonHref;

                if( buttonLinkTarget && buttonLinkTarget == '_blank') {
                    buttonLinkTargetInput.checked = true;
                }
                
                buttotIdInput.value = buttonId;
            }
            
            if( wptbButton ) {
                let buttonTextColor = wptbButton[0].style.color,
                    buttonColor = wptbButton[0].style.backgroundColor,
                    buttonTextColorInput = prop.querySelector( 'input[data-type="button-text-color"]' ),
                    buttonBackgroundColorInput = prop.querySelector( 'input[data-type="button-color"]' );
                
            
                buttonTextColorInput.value = WPTB_Helper.rgbToHex( buttonTextColor );
                
                buttonBackgroundColorInput.value = WPTB_Helper.rgbToHex( buttonColor );
                
            }
        } else if ( element.kind == 'image' ) {
            let affectedEl = document.getElementsByClassName( 'wptb-element-' + kindIndexProt );
            if ( affectedEl.length > 0 ) {
                let elementsA = affectedEl[0].getElementsByTagName( 'a' );
                if ( elementsA.length > 0 ) {
                    let a = elementsA[0];

                    if ( a ) {
                        // set select according to the alignment of the image
                        let imgAlign;
                        if( a.style.float == 'none' || ! a.style.float) {
                            imgAlign = 'center';
                        } else {
                            imgAlign = a.style.float;
                        }
                        let imageAlignmentSelect = prop.getElementsByClassName('wptb-image-alignment-btn');

                        for ( var i = 0; i < imageAlignmentSelect.length; i++ ) {
                            imageAlignmentSelect[i].classList.remove( 'selected' );
                            
                            if ( imageAlignmentSelect[i].getAttribute('data-image_alignment') == imgAlign ) {
                                imageAlignmentSelect[i].classList.add( 'selected' );
                            }
                        }


                        a.onclick = function( e ) {
                            e.preventDefault();
                        }

                        // set text link for input field of setting panel
                        let imageLinkHref = a.getAttribute( 'href' ),
                            inputImageLink = prop.querySelector( 'input[data-type="image-link"]' );
                        if ( imageLinkHref ) {
                            inputImageLink.value = imageLinkHref;
                        }

                        // set checkbox for target of link 
                        let imageLinkTarget = a.getAttribute( 'target' ),
                            imageLinkTargetInput = prop.querySelector( 'input[data-type="image-link-target"]' ),
                            imageLinkTargetInputId = imageLinkTargetInput.getAttribute( 'id' ),
                            imageLinkTargetInputLabel = imageLinkTargetInput.parentNode.getElementsByTagName( 'label' )[0];

                        imageLinkTargetInputId = imageLinkTargetInputId + '-' + kindIndexProt.split( '-' )[1];

                        imageLinkTargetInput.setAttribute( 'id', imageLinkTargetInputId );
                        imageLinkTargetInputLabel.setAttribute( 'for', imageLinkTargetInputId );

                        if ( imageLinkTarget && imageLinkTarget == '_blank' ) {
                            imageLinkTargetInput.checked = true;
                        }

                        // set value for input fields of image size
                        let imgWidth = a.style.width;
                        if ( imgWidth ) {
                            let imageWidthInputRange = prop.querySelector( 'input[type="range"][data-type="image-size"]' ),
                                imageWidthInputNumber = prop.querySelector( 'input[type="number"][data-type="image-size"]' );

                            imageWidthInputRange.value = parseInt( imgWidth );
                            imageWidthInputNumber.value = parseInt( imgWidth );
                        }

                        let img = a.getElementsByTagName( 'img' );
                        if ( img.length > 0 ) {
                            // set value for input field of alternative text image
                            let imgAlternativeText = img[0].getAttribute('alt'),
                                imageAlternativeTextInput = prop.querySelector( 'input[type="text"][data-type="alternative-text"]' );

                            imageAlternativeTextInput.value = imgAlternativeText;
                        }
                    }
                }
            }
        } else if ( element.kind == 'text' ) {
            let affectedEl = document.getElementsByClassName( 'wptb-element-' + kindIndexProt );
            if ( affectedEl.length > 0 ) {
                let elementFontSize = affectedEl[0].style.fontSize,
                    elementTextColor = affectedEl[0].style.color;
                let textFontSizeInputRange = prop.querySelector( 'input[type="range"][data-type="font-size"]' ),
                    textFontSizeInputNumber = prop.querySelector( 'input[type="number"][data-type="font-size"]' ),
                    textColorInput = prop.querySelector( 'input[type="text"][data-type="color"]' );

                textFontSizeInputRange.value = parseInt( elementFontSize ) ? parseInt( elementFontSize ) : 10;
                textFontSizeInputNumber.value = parseInt( elementFontSize ) ? parseInt( elementFontSize ) : 10;
                textColorInput.value = WPTB_Helper.rgbToHex( elementTextColor );
            }
        } else if ( element.kind == 'list' ) {
            let elementList = document.getElementsByClassName( 'wptb-element-' + kindIndexProt );
            if ( elementList.length > 0 ) {
                let elementListColor = elementList[0].querySelector( 'p' ).style.color;
                let listColorInput = prop.querySelector( 'input[type="text"][data-type="list-text-color"]' );
                listColorInput.value = WPTB_Helper.rgbToHex( elementListColor );
                
                let elementListItem = elementList[0].querySelectorAll( 'li' );
                if ( elementListItem.length > 0 ) {
                    let listItemP = elementListItem[0].querySelector( 'p' );
                    let listItemPClasses = listItemP.classList;
                    //listItemPClasses = [...listItemPClasses];
                    if ( listItemPClasses.length > 0 ) {
                        let elementListClassSelect = prop.querySelector( 'select[data-type="list-class"]' );
                        if ( elementListClassSelect ) {
                            elementListClassSelect.value = 'unordered';
                            
                            let listIconSelectLabel = elementListClassSelect.parentNode.nextSibling;
                            for ( let i = 0; i < 10; i++ ) {
                                if ( listIconSelectLabel.nodeType == '1' ) {
                                    break;
                                } else {
                                    listIconSelectLabel = listIconSelectLabel.nextSibling;
                                }
                            }
                            if ( listIconSelectLabel ) {
                                let listIconSelectLabelId = listIconSelectLabel.getAttribute( 'id' );
                                listIconSelectLabel.setAttribute( 'id', listIconSelectLabelId + '-' + kindIndexProt );
                                listIconSelectLabel.style.display = 'flex';
                            }
                            
                            let elementListStyleTypeSelect = prop.querySelector( 'select[data-type="list-style-type"]' );
                            if ( elementListStyleTypeSelect ) {
                                elementListStyleTypeSelect.parentNode.style.display = 'flex';
                                
                                if( listItemPClasses.contains( 'wptb-list-style-type-disc' ) ) {
                                    elementListStyleTypeSelect.value = 'disc';
                                } else if( listItemPClasses.contains( 'wptb-list-style-type-circle' ) ) {
                                    elementListStyleTypeSelect.value = 'circle';
                                } else if( listItemPClasses.contains( 'wptb-list-style-type-square' ) ) {
                                    elementListStyleTypeSelect.value = 'square';
                                } else if ( listItemPClasses.contains( 'wptb-list-style-type-none' ) ) {
                                    elementListStyleTypeSelect.value = 'none';
                                }
                            }
                        }
                    }
                }
                
                let elementListItemContent = elementList[0].getElementsByClassName( 'wptb-list-item-content' );
                if ( elementListItemContent.length > 0 ) {
                    let listItemPTextAlignArr = [];
                    for ( let i = 0; i < elementListItemContent.length; i++ ) {
                        let p = elementListItemContent[i].querySelector( 'p' );
                        if ( p ) {
                            if ( p.style.textAlign ) {
                                listItemPTextAlignArr.push( p.style.textAlign );
                            } else {
                                listItemPTextAlignArr.push( 'left' );
                            }
                        }
                        
                    }
                    
                    let listItemPTextAlignLeftCount = 0,
                        listItemPTextAlignCenterCount = 0,
                        listItemPTextAlignRightCount = 0;
                    
                    if ( listItemPTextAlignArr.length > 0 ) {
                        for ( let i = 0; i < listItemPTextAlignArr.length; i++ ) {
                            if ( listItemPTextAlignArr[i] ) {
                                if ( listItemPTextAlignArr[i] == 'left' ) {
                                    listItemPTextAlignLeftCount++;
                                } else if ( listItemPTextAlignArr[i] == 'center' ) {
                                    listItemPTextAlignCenterCount++;
                                } else if ( listItemPTextAlignArr[i] == 'right' ) {
                                    listItemPTextAlignRightCount++;
                                }
                            }
                        }
                    }
                    
                    let elementListAlignmentSelect = prop.getElementsByClassName('wptb-list-alignment-btn'),
                        maxListItemTAlLeftC = Math.max( listItemPTextAlignLeftCount, listItemPTextAlignCenterCount, listItemPTextAlignRightCount );
                    let wptbListAlignmentValue;
                    if ( listItemPTextAlignLeftCount == maxListItemTAlLeftC ) {
                        wptbListAlignmentValue = 'left';
                    } else if ( listItemPTextAlignCenterCount == maxListItemTAlLeftC ) {
                        wptbListAlignmentValue = 'center';
                    } else if ( listItemPTextAlignRightCount == maxListItemTAlLeftC ) {
                        wptbListAlignmentValue = 'right';
                    }

                    for ( var i = 0; i < elementListAlignmentSelect.length; i++ ) {
                        elementListAlignmentSelect[i].classList.remove( 'selected' );
                        
                        if ( elementListAlignmentSelect[i].getAttribute('data-list_alignment') == wptbListAlignmentValue ) {
                            elementListAlignmentSelect[i].classList.add( 'selected' );
                        }
                    }
                }
            } 
        } else if( element.kind == 'star_rating' ) {
            let affectedEl = document.getElementsByClassName( 'wptb-element-' + kindIndexProt ),wptbRatingAlignment;
            if( affectedEl.length > 0 ) {
                affectedEl = affectedEl[0];
                let ratingStar = affectedEl.querySelector( 'li' );
                if( ratingStar ) {
                    let ratingStarSize = ratingStar.style.width;
                    let starSizeInputRange = prop.querySelector( 'input[type="range"][data-type="star-size"]' ),
                        starSizeInputNumber = prop.querySelector( 'input[type="number"][data-type="star-size"]' );

                    starSizeInputRange.value = parseInt( ratingStarSize ) ? parseInt( ratingStarSize ) : 10;
                    starSizeInputNumber.value = parseInt( ratingStarSize ) ? parseInt( ratingStarSize ) : 10;

                    if( ratingStar.querySelector( 'span' ) ) {
                        let starColorInput = prop.querySelector( 'input[type="text"][data-type="star-color"]' ),
                            ratingStarColor = ratingStar.querySelector( 'span' ).style.fill;
                        starColorInput.value = WPTB_Helper.rgbToHex( ratingStarColor );
                    }
                }
                
                let ratingStars = affectedEl.querySelectorAll( 'li' );
                let starsCountInputNumber = prop.querySelector( 'input[type="number"][data-type="stars-count"]' );
                if( ratingStars.length == 1 && ratingStars[0].style.display == 'none' ) {
                    starsCountInputNumber.value = 0;
                } else {
                    starsCountInputNumber.value = ratingStars.length;
                }

                // Rating default/saved alignment from icons in left panel
                if ( affectedEl ) {
                    wptbRatingAlignment = affectedEl.style.textAlign;
                }
                
                if( wptbRatingAlignment ) {
                    var b = prop.getElementsByClassName('wptb-rating-alignment-btn');
                    
                    for ( var i = 0; i < b.length; i++ ) {
                        b[i].classList.remove( 'selected' );
                        
                        if ( b[i].getAttribute('data-star_alignment') == wptbRatingAlignment ) {
                            b[i].classList.add( 'selected' );
                        }
                    }
                }

                let successBox = affectedEl.querySelector( '.wptb-success-box' );
                if( successBox ) {
                    let showNumberRatingCheckbox = prop.querySelector( 'input[type="checkbox"][data-type="show-number-rating"]' );
                    if( successBox.style.display == 'block' ) {
                        showNumberRatingCheckbox.checked = true;
                        let numeralRatingOptionContainers = prop.getElementsByClassName( 'wptb-numeral-rating-option-container' );
                        for( let i = 0; i < numeralRatingOptionContainers.length; i++ ) {
                            numeralRatingOptionContainers[i].style.display = 'block';
                        }
                    } else {
                        showNumberRatingCheckbox.checked = false;
                    }

                    let wptbTextMessage = successBox.querySelector( '.wptb-text-message' );
                    if( wptbTextMessage ) {
                        let numberRatingSize = wptbTextMessage.style.fontSize;
                        let numberRatingColor = wptbTextMessage.style.color;

                        let numberSizeInputRange = prop.querySelector( 'input[type="range"][data-type="numeral-rating-size"]' ),
                        numberSizeInputNumber = prop.querySelector( 'input[type="number"][data-type="numeral-rating-size"]' ),
                        numberColorInput = prop.querySelector( 'input[type="text"][data-type="numeral-rating-color"]' );

                        numberSizeInputRange.value = parseInt( numberRatingSize ) ? parseInt( numberRatingSize ) : 10;
                        numberSizeInputNumber.value = parseInt( numberRatingSize ) ? parseInt( numberRatingSize ) : 10;
                        numberColorInput.value = WPTB_Helper.rgbToHex( numberRatingColor );
                    }
                }
            }
        }
    }

    node.onclick = function () {
        var infArr = this.className.match(/wptb-element-((.+-)\d+)/i),
            optionsClass = '.wptb-' + infArr[2] + 'options' +
                '.wptb-options-' + infArr[1];

        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
        document.getElementById("element-options-group").style.display = 'block';

        var children = document.getElementById("element-options-group").childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].style)
                children[i].style.display = 'none';
        }

        document.querySelector(optionsClass).style.display = 'block';

                //var listStyleType, textAlign;

//        switch (element.kind) {

//            case 'text':
//                jQuery(prop).find('[data-type=color]').wpColorPicker({ defaultColor: node.style.color });
//                prop.querySelector('[type=number][data-type=font-size]').value
//                    = prop.querySelector('[type=range][data-type=font-size]').value
//                    = node.style.fontSize.substring(0, node.style.fontSize.length - 2);
//                break;
//            case 'list':
//                textAlign = node.querySelector('li p').style.textAlign;
//                listStyleType = node.querySelector('li').style.listStyleType;
//                if ( prop.querySelector( 'select[data-type=list-class]' ) ) {
//                console.log(textAlign);
//                console.log(listStyleType);
//                console.log(listStyleType);
//                console.log(prop);
//                    prop.querySelector('select[data-type=list-class]').selectedIndex = ( listStyleType == 'decimal' ? 0 : 1 );
//                }
//                if ( prop.querySelector('select[data-type=list-style-type]') ) {
//                    prop.querySelector('select[data-type=list-style-type]').selectedIndex = (listStyleType == 'circle' ? 0 : (listStyleType == 'square' ? 1 : 2));
//                }
//                if ( prop.querySelector('select[data-type=list-alignment]') ) {
//                    prop.querySelector('select[data-type=list-alignment]').selectedIndex = (textAlign == 'left' ? 0 : (textAlign == 'center' ? 1 : 2));
//                }
//                break;
//            case 'image':
//                break;
//            case 'button':
//                jQuery(prop).find('[data-type=button-color]').wpColorPicker({ defaultColor: node.style.backgroundColor });
//                break;
//
//        }
    };

    if (element.kind == 'button') {
        //We must add this special kind of property, since it is triggered with click event
        var buttons = prop.getElementsByClassName('wptb-btn-size-btn');

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function () {
                var size = this.innerHTML,
                    n_Class = this.dataset.element,
                    infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                    type = infArr[1],
                    num = infArr[2],
                    affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];
                affectedEl.classList.remove('wptb-size-S');
                affectedEl.classList.remove('wptb-size-M');
                affectedEl.classList.remove('wptb-size-L');
                affectedEl.classList.remove('wptb-size-XL');
                affectedEl.classList.add('wptb-size-' + size);
                var b = this.parentNode.getElementsByClassName('wptb-btn-size-btn');
                for (var i = 0; i < b.length; i++) {
                    b[i].classList.remove('selected');
                }
                this.classList.add('selected');
                
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            }
        }
    }

    /*
    * alignment option in left panel using icons for star-rating
    */
    if (element.kind == 'star_rating') {
            //We must add this special kind of property, since it is triggered with click event
            var buttons = prop.getElementsByClassName('wptb-rating-alignment-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function () {
                    var star_alignment = this.getAttribute('data-star_alignment'),
                        n_Class = this.dataset.element,
                        infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                        type = infArr[1],
                        num = infArr[2],
                        affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];
                        affectedEl.style.textAlign = star_alignment;

                    var b = this.parentNode.getElementsByClassName('wptb-rating-alignment-btn');
                    for (var i = 0; i < b.length; i++) {
                        b[i].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                }
            }
        }
    /*
    * alignment option in left panel using icons for list
    */
    if (element.kind == 'list') {
            //We must add this special kind of property, since it is triggered with click event
            var buttons = prop.getElementsByClassName('wptb-list-alignment-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function () {
                    var list_alignment = this.getAttribute('data-list_alignment'),
                        n_Class = this.dataset.element,
                        infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                        type = infArr[1],
                        num = infArr[2],
                        affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];

                        let listItems = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < listItems.length; i++) {
                            let p = listItems[i].querySelector( 'p' );
                            if ( p ) {
                                p.style.textAlign = list_alignment;
                            }
                        }

                    var b = this.parentNode.getElementsByClassName('wptb-list-alignment-btn');
                    for (var i = 0; i < b.length; i++) {
                        b[i].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                }
            }
        }
    /*
    * alignment option in left panel using icons for button
    */
    if (element.kind == 'button') {
            //We must add this special kind of property, since it is triggered with click event
            var buttons = prop.getElementsByClassName('wptb-button-alignment-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function () {
                    var button_alignment = this.getAttribute('data-button_alignment'),
                        n_Class = this.dataset.element,
                        infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                        type = infArr[1],
                        num = infArr[2],
                        affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];

                        var jc = '';
                        if (button_alignment == 'left') {
                            jc = 'start';
                        } else if (button_alignment == 'right') {
                            jc = 'flex-end';
                        } else {
                            jc = 'center';
                        }
                        affectedEl.getElementsByClassName('wptb-button-wrapper')[0].style.justifyContent = jc;

                    var b = this.parentNode.getElementsByClassName('wptb-button-alignment-btn');
                    for (var i = 0; i < b.length; i++) {
                        b[i].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                }
            }
        }

    /*
    * alignment option in left panel using icons for image
    */
    if (element.kind == 'image') {
            //We must add this special kind of property, since it is triggered with click event
            var buttons = prop.getElementsByClassName('wptb-image-alignment-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function () {
                    var image_alignment = this.getAttribute('data-image_alignment'),
                        n_Class = this.dataset.element,
                        infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                        type = infArr[1],
                        num = infArr[2],
                        affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];

                        var image_alignment_value = '';
                        if (image_alignment == 'left') {
                            image_alignment_value = 'left';
                        } else if (image_alignment == 'right') {
                            image_alignment_value = 'right';
                        } else {
                            image_alignment_value = 'none';
                        }
                        
                        affectedEl.querySelector( '.wptb-image-wrapper a' ).style.float = image_alignment_value;

                    var b = this.parentNode.getElementsByClassName('wptb-image-alignment-btn');
                    for (var i = 0; i < b.length; i++) {
                        b[i].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                }
            }
        }

    var optionControls = prop.getElementsByClassName('wptb-element-property');

    for (var i = 0; i < optionControls.length; i++) {
        if ( optionControls[i].classList.contains( 'wptb-color-picker' ) ) {
            jQuery(optionControls[i]).wpColorPicker({
                change: function ( event, ui ) {
                    WPTB_Helper.wpColorPickerChange( event, ui );
                    
                    //console.log(event);
                    WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                },
                clear: function( event ) {
                    WPTB_Helper.wpColorPickerChange( event );
                }
            });
        }
        
        if( optionControls[i].classList.contains( 'wptb-stars-count-field' ) ) {
            WPTB_Helper.numberImputSize( optionControls[i], 1, 10 );
        }

        if ( optionControls[i].dataset.type === 'font-size' || optionControls[i].dataset.type === 'image-size' ||
               optionControls[i].dataset.type === 'star-size' || optionControls[i].dataset.type === 'numeral-rating-size' ) {
            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0];
            slider.oninput = function () {
                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].onchange( event );
            }
        }

//        if (optionControls[i].dataset.type === 'image-size') {
//            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0];
//            slider.oninput = function () {
//                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
//                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].onchange( event );
//            }
//        }
//        
//        if ( optionControls[i].dataset.type === 'star-size' ) {
//            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0];
//            slider.oninput = function () {
//                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
//                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].onchange( event );
//            }
//        }

        optionControls[i].onchange = function ( event ) {
            var n_Class = this.dataset.element,
                infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                type = infArr[1],
                num = infArr[2],
                affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0],
                val = this.value;

            switch ( this.dataset.type ) {
                case 'src':
                    var img = affectedEl.getElementsByTagName("img")[0];
                    img.src = this.value;
                    break;
                case 'alternative-text':
                    var img = affectedEl.getElementsByTagName('img')[0];
                    img.alt = this.value;
                    break;
                case 'image-link':
                    affectedEl.getElementsByTagName('a')[0].href = WPTB_Helper.linkHttpCheckChange( this.value );
                    break;
                case 'image-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'image-link-nofollow':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].rel = 'nofollow';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].removeAttribute('rel');
                    }
                    break;
                case 'image-size':
                    affectedEl.getElementsByTagName('a')[0].style.width = this.value + '%';
                    affectedEl.getElementsByTagName('a')[0].style.height = 'auto';
                    this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].value = this.value;
                    break;
                /*case 'image-alignment':
                    let wptbImageFloatValue = '';
                    if( this.value == 'center' ) {
                        wptbImageFloatValue = 'none';
                    } else {
                        wptbImageFloatValue = this.value;
                    }
                    affectedEl.querySelector( '.wptb-image-wrapper a' ).style.float = wptbImageFloatValue;
                    break;*/
                case 'font-size':
                    affectedEl.style.fontSize = val + 'px';
                    this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].value = this.value;
                    break;
                // case 'button-alignment':
                //     var jc = '';
                //     if (this.value == 'left') {
                //         jc = 'start';
                //     } else if (this.value == 'right') {
                //         jc = 'flex-end';
                //     } else {
                //         jc = 'center';
                //     }
                //     affectedEl.getElementsByClassName('wptb-button-wrapper')[0].style.justifyContent = jc;
                //     break;
                case 'rating-alignment':
                    var jc = '';
                    if (this.value == 'left') {
                        jc = 'start';
                    } else if (this.value == 'right') {
                        jc = 'right';
                    } else {
                        jc = 'center';
                    }
                    affectedEl.style.textAlign = jc;
                    break;
                case 'button-link':
                    if ( this.value ) {
                        affectedEl.getElementsByTagName( 'a' )[0].href = WPTB_Helper.linkHttpCheckChange( this.value );
                    } else {
                        affectedEl.getElementsByTagName( 'a' )[0].removeAttribute( 'href' );
                    }
                    break;
                case 'button-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'button-link-nofollow':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].rel = 'nofollow';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].removeAttribute( 'rel' );
                    }
                    break;
                case 'button-id':
                    if( this.value ) {
                        affectedEl.getElementsByTagName( 'a' )[0].id = this.value;
                    } else {
                        affectedEl.getElementsByTagName( 'a' )[0].removeAttribute( 'id' );
                    }
                case 'button-color':
                    break;
                // case 'list-alignment':
                //     let listItems = affectedEl.querySelectorAll('li');
                //     for (var i = 0; i < listItems.length; i++) {
                //         let p = listItems[i].querySelector( 'p' );
                //         if ( p ) {
                //             p.style.textAlign = this.value;
                //         }
                //     }
                //     break;
                case 'list-class':
                    let parentNode = event.target
                            .parentNode
                            .parentNode
                            .querySelector('[data-type=list-style-type]')
                            .parentNode,
                        parentNodeSettingItem = parentNode.parentNode;
                    if (val == 'unordered') {
                        parentNode.style.display = 'flex';
                        
                        parentNodeSettingItem.querySelector( '.wptb-list-icon-select-label' ).style.display = 'flex';
                        let listItem = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < listItem.length; i++) {
                            let p = listItem[i].querySelector( 'p' );
                            p.removeAttribute ( 'class' );
                            p.classList.add( 'wptb-list-style-type-disc' );
                        }
                        parentNodeSettingItem.querySelector('[data-type=list-style-type]').value = 'disc';
                    } else {
                        parentNode.style.display = 'none';
                        parentNodeSettingItem.querySelector( '.wptb-list-icon-select-label' ).style.display = 'none';
                        var listItem = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < listItem.length; i++) {
                            let p = listItem[i].querySelector( 'p' );
                            p.removeAttribute ( 'class' );
                        }
                    }
                    break;
                case 'list-style-type':
                    var listItem = affectedEl.querySelectorAll('li');
                    for (var i = 0; i < listItem.length; i++) {
                        let p = listItem[i].querySelector( 'p' );
                        p.removeAttribute ( 'class' );
                        p.classList.add( 'wptb-list-style-type-' + val.toLowerCase() );
                    }
                    break;
                case 'star-size':
                    let ratingStar = affectedEl.querySelectorAll('li');
                    for( let i = 0; i < ratingStar.length; i++ ) {
                        ratingStar[i].style.width = val + 'px';
                        ratingStar[i].style.height = val + 'px';
                        let span = ratingStar[i].querySelectorAll( 'span' );
                        for( let j = 0; j < span.length; j++ ) {
                            if( span[j].querySelector( 'svg' ) ) {
                                span[j].style.width = val + 'px';
                                span[j].style.height = val + 'px';
                                span[j].querySelector( 'svg' ).style.width = val + 'px';
                            }
                        }
                    }
                    break;
                case 'show-number-rating':
                    let wptbNumeralRatingOptionContainer = WPTB_Helper.findAncestor( this, 'wptb-star_rating-options' )
                    .getElementsByClassName( 'wptb-numeral-rating-option-container' );
                    
                    WPTB_Helper.starRatingTextMessageChenge( affectedEl );
                    
                    if( wptbNumeralRatingOptionContainer.length > 0 ) {
                        let wptbTextMessage = affectedEl.querySelector( '.wptb-text-message' );
                        
                        let val = this.checked ? 'checked' : 'unchecked';
                        if( val== 'checked' ) {
                            for ( let i = 0; i < wptbNumeralRatingOptionContainer.length; i++ ) {
                                wptbNumeralRatingOptionContainer[i].style.display = 'block';
                            }
                            wptbTextMessage.parentNode.style.display = 'block';
                        } else if ( val == 'unchecked' ) {
                            for ( let i = 0; i < wptbNumeralRatingOptionContainer.length; i++ ) {
                                wptbNumeralRatingOptionContainer[i].style.display = 'none';
                            }
                            wptbTextMessage.parentNode.style.display = 'none';
                        }
                    }
                    break;
                case 'numeral-rating-size':
                    let wptbTextMessageSize = affectedEl.querySelector('.wptb-text-message');
                    wptbTextMessageSize.style.fontSize = val + 'px';
                    wptbTextMessageSize.style.height = val + 'px';
                    wptbTextMessageSize.style.lineHeight = val + 'px';
                    break;
                case 'stars-count':
                    let starRatings = affectedEl.querySelectorAll( 'li' );
                    
                    let starRatingsCount = starRatings.length;
                    
                    if( val > starRatingsCount ) {
                        let difference = val - starRatingsCount;
                        let starRatingsLast = starRatings[starRatings.length - 1];
                        
                        let parent = starRatingsLast.parentNode;
                        for( let i = 0; i < difference; i++ ){
                            let newStarRating = starRatingsLast.cloneNode( true );
                            newStarRating.removeAttribute( 'class' );
                            newStarRating.setAttribute( 'class', 'wptb-rating-star' );
                            newStarRating.dataset.value = parseInt(starRatingsLast.dataset.value) + i + 1;
                            WPTB_Helper.starRatingEventHandlersAdd( newStarRating );
                            parent.appendChild( newStarRating );
                        }
                    } else if( val < starRatingsCount ) {
                            let difference = parseInt( starRatingsCount ) - parseInt( val );
                            
                            if( val == 0 ) {
                                difference--;
                                starRatings[0].removeAttribute( 'class' );
                                starRatings[0].setAttribute( 'class', 'wptb-rating-star' );
                                starRatings[0].style.display = 'none';
                            }
                            
                            let starRatingLength = starRatings.length;
                            for( i = 0; i < difference; i++ ) {
                                starRatings[0].parentNode.removeChild( starRatings[starRatingLength - i - 1] );
                            }
                    } else if( val == starRatingsCount && starRatingsCount == 1 ) {
                        starRatings[0].style.display = 'inline-block';
                    }
                    
                    WPTB_Helper.starRatingTextMessageChenge( affectedEl );
                    
                    break;
            }
            
            
            if( event.target.classList.contains( 'wptb-size-slider' ) || event.target.classList.contains( 'wptb-size-slider' ) ) {
                event.target.onmouseup = function() {
                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                }
            } else {
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            }
        }
    }
};