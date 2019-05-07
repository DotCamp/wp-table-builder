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
                
                wptbButton = affectedEl.getElementsByClassName( 'wptb-button' )
            }
            
            if ( wptbButtonWrapper ) {
                let buttonAlignment = wptbButtonWrapper[0].style.justifyContent,
                buttonAlignmentSelect = prop.querySelector( 'select[data-type="button-alignment"]' ),
                    selectOption = buttonAlignmentSelect.getElementsByTagName( 'option' ),
                    selectOptionVal;
                
                if ( buttonAlignment == 'flex-start' ) {
                    selectOptionVal = 'left';
                } else if ( buttonAlignment == 'center' || ! buttonAlignment ) {
                    selectOptionVal = 'center';
                } else if ( buttonAlignment == 'flex-end' ) {
                    selectOptionVal = 'right';
                }
                
                for ( let i = 0; i < selectOption.length; i++ ) {
                    if ( selectOption[i].value == selectOptionVal ) {
                        selectOption[i].selected = true;
                    }
                }
            }
            
            if( wptbButton ) {
                let buttonTextColor = wptbButton[0].style.color,
                    buttonColor = wptbButton[0].style.backgroundColor,
                    buttonHref = wptbButton[0].getAttribute( 'href' ), 
                    buttonLinkTarget = wptbButton[0].getAttribute( 'target' ),
                    buttonTextColorInput = prop.querySelector( 'input[data-type="button-text-color"]' ),
                    buttonBackgroundColorInput = prop.querySelector( 'input[data-type="button-color"]' ),
                    buttonHrefInput = prop.querySelector( 'input[data-type="button-link"]' ),
                    buttonLinkTargetInput = prop.querySelector( 'input[data-type="button-link-target"]' ),
                    buttonLinkTargetInputId = buttonLinkTargetInput.getAttribute( 'id' ),
                    buttonLinkTargetInputLabel = buttonLinkTargetInput.parentNode.getElementsByTagName( 'label' )[0];
                    
                buttonLinkTargetInputId = buttonLinkTargetInputId + '-' + kindIndexProt.split( '-' )[1];

                buttonLinkTargetInput.setAttribute( 'id', buttonLinkTargetInputId );
                buttonLinkTargetInputLabel.setAttribute( 'for', buttonLinkTargetInputId );
            
                buttonTextColorInput.value = buttonTextColor;
                
                buttonBackgroundColorInput.value = buttonColor;
                
                buttonHrefInput.value = buttonHref;
                
                if( buttonLinkTarget && buttonLinkTarget == '_blank') {
                    buttonLinkTargetInput.checked=true;
                }
            }
        } else if ( element.kind == 'image' ) {
            let affectedEl = document.getElementsByClassName( 'wptb-element-' + kindIndexProt );
            if ( affectedEl.length > 0 ) {
                let elementsA = affectedEl[0].getElementsByTagName( 'a' );
                if ( elementsA.length > 0 ) {
                    let a = elementsA[0];

                    if ( a ) {
                        a.onclick = function( e ) {
                            e.preventDefault();
                        }
                        // set select according to the alignment of the image
                        let aTextAlign = a.style.textAlign,
                        imageAlignmentSelect = prop.querySelector( 'select[data-type="image-alignment"]' ),
                        selectOption = imageAlignmentSelect.getElementsByTagName( 'option' );

                        for ( let i = 0; i < selectOption.length; i++ ) {
                            if ( selectOption[i].value == aTextAlign ) {
                                selectOption[i].selected = true;
                            }
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

                        let img = a.getElementsByTagName( 'img' );
                        if ( img.length > 0 ) {
                            // set value for input fields of image size
                            let imgWidth = img[0].style.width;
                            if ( imgWidth ) {
                                let imageWidthInputRange = prop.querySelector( 'input[type="range"][data-type="image-size"]' ),
                                    imageWidthInputNumber = prop.querySelector( 'input[type="number"][data-type="image-size"]' );

                                imageWidthInputRange.value = parseInt( imgWidth );
                                imageWidthInputNumber.value = parseInt( imgWidth );
                            }

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

                textFontSizeInputRange.value = parseInt( elementFontSize );
                textFontSizeInputNumber.value = parseInt( elementFontSize );
                textColorInput.value = elementTextColor;
            }
        } else if ( element.kind == 'list' ) {
            let elementList = document.getElementsByClassName( 'wptb-element-' + kindIndexProt );
            if ( elementList.length > 0 ) {
                let elementListItem = elementList[0].querySelectorAll( 'li' );
        
                if ( elementListItem.length > 0 ) {
                    let listItemStyleType = elementListItem[0].style.listStyleType;
                    if ( listItemStyleType && listItemStyleType != 'decimal' ) {
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
                                
                                elementListStyleTypeSelect.value = listItemStyleType;
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
                    
                    let elementListAlignmentSelect = prop.querySelector( 'select[data-type="list-alignment"]' ),
                        maxListItemTAlLeftC = Math.max( listItemPTextAlignLeftCount, listItemPTextAlignCenterCount, listItemPTextAlignRightCount );
                
                    if ( listItemPTextAlignLeftCount == maxListItemTAlLeftC ) {
                        elementListAlignmentSelect.value = 'left';
                    } else if ( listItemPTextAlignCenterCount == maxListItemTAlLeftC ) {
                        elementListAlignmentSelect.value = 'center';
                    } else if ( listItemPTextAlignRightCount == maxListItemTAlLeftC ) {
                        elementListAlignmentSelect.value = 'right';
                    }
                }
            } 
        }
    }

    node.onclick = function () {
        var infArr = this.className.match(/wptb-element-((.+-)\d+)/i),
            optionsClass = '.wptb-' + infArr[2] + 'options' +
                '.wptb-options-' + infArr[1];

        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

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
            }
        }
    }

    var optionControls = prop.getElementsByClassName('wptb-element-property');

    for (var i = 0; i < optionControls.length; i++) {
        if (optionControls[i].classList.contains('wptb-color-picker')) {
            jQuery(optionControls[i]).wpColorPicker({
                change: function (event, ui) {
                    var parent = event.target, classe, type, ps, number;
                    classe = parent.dataset.element.match(/wptb-options-(.+)-(\d+)/i);
                    type = classe[1];
                    number = classe[2];
                    affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + number)[0];
                    if (type == 'button') {
                        if (parent.dataset.type == 'button-text-color') {
                            affectedEl.getElementsByClassName('wptb-button')[0].style.color = ui.color.toString();
                        } else {
                            affectedEl.getElementsByClassName('wptb-button')[0].style.backgroundColor = ui.color.toString();
                        }
                    } else {
                        affectedEl.style.color = ui.color.toString();
                    }
                }
            });
        }

        if (optionControls[i].dataset.type === 'font-size') {
            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-text-font-size-slider')[0];
            slider.oninput = function () {
                this.parentNode.parentNode.getElementsByClassName('wptb-text-font-size-number')[0].value = this.value;
                this.parentNode.parentNode.getElementsByClassName('wptb-text-font-size-number')[0].onchange();
            }
        }

        if (optionControls[i].dataset.type === 'image-size') {
            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-image-size-slider')[0];
            slider.oninput = function () {
                this.parentNode.parentNode.getElementsByClassName('wptb-image-width-number')[0].value = this.value;
                this.parentNode.parentNode.getElementsByClassName('wptb-image-width-number')[0].onchange();
            }
        }

        optionControls[i].onchange = function (event) {

            var n_Class = this.dataset.element,
                infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                type = infArr[1],
                num = infArr[2],
                affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0],
                val = this.value;

            switch (this.dataset.type) {
                case 'src':
                    var img = affectedEl.getElementsByTagName("img")[0];
                    img.src = this.value;
                    break;
                case 'alternative-text':
                    var img = affectedEl.getElementsByTagName('img')[0];
                    img.alt = this.value;
                    break;
                case 'image-link':
                    affectedEl.getElementsByTagName('a')[0].href = this.value;
                    break;
                case 'image-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'image-size':
                    affectedEl.getElementsByTagName('img')[0].style.width = this.value + '%';
                    affectedEl.getElementsByTagName('img')[0].style.height = 'auto';
                    this.parentNode.parentNode.getElementsByClassName('wptb-image-size-slider')[0].value = this.value;
                    break;
                case 'image-alignment':
                    affectedEl.getElementsByTagName( 'img' )[0].parentNode.style.textAlign = this.value;
                    break;
                case 'font-size':
                    affectedEl.style.fontSize = val + 'px';
                    break;
                case 'button-alignment':
                    var jc = '';
                    if (this.value == 'left') {
                        jc = 'start';
                    } else if (this.value == 'right') {
                        jc = 'flex-end';
                    } else {
                        jc = 'center';
                    }
                    affectedEl.getElementsByClassName('wptb-button-wrapper')[0].style.justifyContent = jc;
                    break;
                case 'button-link':
                    affectedEl.getElementsByTagName('a')[0].href = this.value;
                    break;
                case 'button-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'button-color':
                    break;
                case 'list-alignment':
                    let listItems = affectedEl.querySelectorAll('li');
                    for (var i = 0; i < listItems.length; i++) {
                        let p = listItems[i].querySelector( 'p' );
                        if ( p ) {
                            p.style.textAlign = this.value;
                        }
                    }
                    break;
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
                            listItem[i].style.listStyleType = 'disc';
                        }
                        parentNodeSettingItem.querySelector('[data-type=list-style-type]').value = 'disc';
                    } else {
                        parentNode.style.display = 'none';
                        parentNodeSettingItem.querySelector( '.wptb-list-icon-select-label' ).style.display = 'none';
                        var listItem = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < listItem.length; i++) {
                            listItem[i].style.listStyleType = 'decimal';
                        }
                    }
                    break;
                case 'list-style-type':
                    var listItem = affectedEl.querySelectorAll('li');
                    for (var i = 0; i < listItem.length; i++) {
                        listItem[i].style.listStyleType = val.toLowerCase();
                    }
                    break;
            }
        }
    }
};